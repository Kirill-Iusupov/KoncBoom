"""
Движок расчёта цен корзины.

ЕДИНАЯ точка правды для цен с учётом условных акций. Используется:
  - POST /api/orders/preview/  — предпросмотр корзины для витрины
  - services.create_order()    — фиксация unit_price при оформлении

Именно поэтому расчёт вынесен сюда, а не размазан по двум местам:
если preview и заказ считают цену разным кодом, они рано или поздно
разойдутся в округлении или в трактовке условия, и покупатель увидит
одну сумму в корзине, а в заказе — другую. Это деньги, тут расхождений
быть не должно.

Product.current_price остаётся, но отвечает только за БЕЗУСЛОВНЫЕ акции
(витрина каталога, где корзины ещё нет).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal
from typing import Any, Iterable

from core.utils import calc_discounted_price

from .models import Product, Promotion


@dataclass(frozen=True)
class PricedLine:
    """Одна посчитанная позиция корзины."""

    product: Product
    quantity: int
    unit_price: Decimal          # обычная цена за штуку
    final_unit_price: Decimal    # цена за штуку с учётом акции
    promo: Promotion | None      # применённая акция (None — скидки нет)
    hint: str                    # подсказка-апселл, "" если не нужна

    @property
    def line_total(self) -> Decimal:
        return self.final_unit_price * self.quantity

    @property
    def line_subtotal(self) -> Decimal:
        """Стоимость позиции без скидки."""
        return self.unit_price * self.quantity

    @property
    def line_discount(self) -> Decimal:
        return self.line_subtotal - self.line_total

    @property
    def has_discount(self) -> bool:
        return self.final_unit_price < self.unit_price


@dataclass(frozen=True)
class PricedCart:
    """Результат расчёта всей корзины."""

    lines: list[PricedLine] = field(default_factory=list)

    @property
    def subtotal(self) -> Decimal:
        """Сумма без скидок."""
        return sum((line.line_subtotal for line in self.lines), Decimal("0.00"))

    @property
    def total(self) -> Decimal:
        """Итог к оплате."""
        return sum((line.line_total for line in self.lines), Decimal("0.00"))

    @property
    def discount_total(self) -> Decimal:
        return self.subtotal - self.total

    def unit_price_map(self) -> dict[int, Decimal]:
        """{product_id: final_unit_price} — для фиксации цен в заказе."""
        return {line.product.pk: line.final_unit_price for line in self.lines}


def products_for_pricing(product_ids: Iterable[int]):
    """
    QuerySet товаров, готовый для расчёта, без N+1.

    select_related тянет и саму акцию, и товар-условие (нужен для
    condition_text/hint — иначе на каждую позицию был бы лишний запрос).
    """
    return Product.objects.select_related(
        "promotion", "promotion__required_product"
    ).filter(pk__in=product_ids)


def price_cart(
    items: list[dict[str, Any]],
    products: dict[int, Product] | None = None,
) -> PricedCart:
    """
    Считает корзину с учётом всех типов акций.

    items    — [{"product_id": int, "quantity": int}, ...]
               Дубли product_id недопустимы (проверяется сериализатором).
    products — уже загруженные товары {pk: Product}. Передаётся из
               create_order, где строки уже заблокированы select_for_update:
               повторно загружать их нельзя, иначе потеряем блокировку.
               Если не передан — грузим сами.

    Товары, которых нет в products, молча пропускаются: проверка
    существования — задача вызывающего кода (сериализатор в preview,
    явная ошибка в create_order).
    """
    if products is None:
        product_ids = [item["product_id"] for item in items]
        products = {p.pk: p for p in products_for_pricing(product_ids)}

    # Полная картина корзины — нужна для условия "нужен другой товар".
    cart_quantities: dict[int, int] = {
        item["product_id"]: item["quantity"] for item in items
    }

    lines: list[PricedLine] = []

    for item in items:
        product = products.get(item["product_id"])
        if product is None:
            continue

        quantity: int = item["quantity"]
        unit_price: Decimal = product.price
        promo: Promotion | None = getattr(product, "promotion", None)

        if promo is not None and promo.is_satisfied(quantity, cart_quantities):
            # Скидка применяется ко ВСЕМ единицам позиции — согласовано
            # с заказчиком (12 шт при пороге 10 -> скидка на все 12).
            final_unit_price = calc_discounted_price(unit_price, promo.discount)
            applied = promo
            hint = ""
        else:
            final_unit_price = unit_price
            applied = None
            hint = _build_hint(promo, quantity, cart_quantities)

        lines.append(
            PricedLine(
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                final_unit_price=final_unit_price,
                promo=applied,
                hint=hint,
            )
        )

    return PricedCart(lines=lines)


def _build_hint(
    promo: Promotion | None,
    quantity: int,
    cart_quantities: dict[int, int],
) -> str:
    """
    Подсказка-апселл для позиции, у которой есть акция, но условие
    ещё не выполнено («добавьте ещё 3 шт — скидка 15%»).

    Собирается на бэкенде, чтобы фронт не считал недостающее количество
    сам — иначе формулировка и арифметика начнут расходиться с реальным
    условием акции.
    """
    if promo is None or not promo.is_active:
        return ""

    if promo.condition_type == Promotion.ConditionType.MIN_QUANTITY:
        missing = (promo.min_quantity or 0) - quantity
        if missing <= 0:
            return ""
        return f"Добавьте ещё {missing} шт — скидка {promo.discount}%"

    if promo.condition_type == Promotion.ConditionType.REQUIRES_PRODUCT:
        if not promo.required_product_id:
            return ""
        needed = promo.required_quantity or 1
        in_cart = cart_quantities.get(promo.required_product_id, 0)
        missing = needed - in_cart
        if missing <= 0:
            return ""
        name = promo.required_product.title
        if needed > 1:
            return (
                f"Добавьте «{name}» ({missing} шт) — скидка {promo.discount}%"
            )
        return f"Добавьте «{name}» — скидка {promo.discount}%"

    return ""