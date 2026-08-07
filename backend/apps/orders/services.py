"""
Сервисный слой заказов.

Вся бизнес-логика оформления заказа живёт здесь — НЕ во view и НЕ в сериализаторе.
View только вызывает create_order() и возвращает результат клиенту.

Защита от race condition (одновременные заказы одного товара):
  1. transaction.atomic()     — всё или ничего
  2. select_for_update()      — блокировка строк товаров на время транзакции
  3. F('stock') - quantity    — атомарное списание на уровне SQL (не Python)
  4. CHECK constraint stock>=0 — БД отклонит уход в минус даже при обходе 1-3

Идемпотентность:
  - Если заказ с idempotency_key уже существует — возвращаем его без повторного
    списания stock. Это защита от двойного сабмита при сетевых ретраях.

Цены и акции:
  - unit_price фиксируется через apps.catalog.pricing.price_cart() — тот же
    движок, что обслуживает POST /api/orders/preview/. Раньше здесь была
    Product.current_price, но она видит только один товар и не умеет
    в условные акции («от 10 шт», «нужен другой товар»), которые зависят
    от состава корзины. Общий движок гарантирует, что сумма в корзине
    покупателя и сумма в оформленном заказе совпадут.
  - Цена клиента НИКОГДА не принимается на веру: фронт присылает только
    product_id и quantity, все цены считает сервер.

select_for_update() + select_related:
  - promotion и promotion__required_product — необязательные связи, поэтому
    select_related строит LEFT OUTER JOIN. PostgreSQL запрещает
    `SELECT ... FOR UPDATE` поверх такого джойна, поэтому of=("self",):
    блокируем только строки Product, джойны остаются доступны для чтения.
"""

import uuid
from typing import Any

from django.db import IntegrityError, transaction
from django.db.models import F

from apps.catalog.models import Product
from apps.catalog.pricing import price_cart

from .models import Order, OrderItem


class InsufficientStockError(Exception):
    """Недостаточно товара на складе."""

    def __init__(self, product_title: str, available: int, requested: int) -> None:
        self.product_title = product_title
        self.available = available
        self.requested = requested
        super().__init__(
            f"Товар «{product_title}»: запрошено {requested}, доступно {available}."
        )


def create_order(
    *,
    idempotency_key: uuid.UUID,
    guest_name: str,
    guest_phone: str,
    guest_address: str,
    comment: str,
    items: list[dict[str, Any]],
) -> tuple[Order, bool]:
    """
    Атомарно создаёт заказ и списывает stock товаров.

    Возвращает кортеж (order, created):
      - created=True  — заказ только что создан
      - created=False — заказ с таким idempotency_key уже существовал (ретрай)

    items: [{"product_id": int, "quantity": int}, ...]

    Raises:
        InsufficientStockError — если stock < quantity для любого товара.
        Product.DoesNotExist   — если product_id не найден.
    """
    try:
        existing = Order.objects.get(idempotency_key=idempotency_key)
        return existing, False
    except Order.DoesNotExist:
        pass

    product_ids = [item["product_id"] for item in items]

    with transaction.atomic():
        # Блокируем строки товаров. select_related нужен движку цен:
        # он читает promotion и promotion.required_product.
        products: dict[int, Product] = {
            p.pk: p
            for p in Product.objects.select_related(
                "promotion", "promotion__required_product"
            )
            .select_for_update(of=("self",))
            .filter(pk__in=product_ids)
        }

        for item in items:
            pid = item["product_id"]
            if pid not in products:
                raise Product.DoesNotExist(f"Товар с id={pid} не найден.")

        for item in items:
            product = products[item["product_id"]]
            qty = item["quantity"]
            if product.stock < qty:
                raise InsufficientStockError(
                    product_title=product.title,
                    available=product.stock,
                    requested=qty,
                )

        # Считаем цены ТЕМ ЖЕ движком, что и preview. products передаём
        # уже загруженными — иначе price_cart сделает свой запрос и мы
        # потеряем блокировку select_for_update на этих строках.
        priced = price_cart(items, products=products)
        unit_prices = priced.unit_price_map()

        try:
            order = Order.objects.create(
                idempotency_key=idempotency_key,
                guest_name=guest_name,
                guest_phone=guest_phone,
                guest_address=guest_address,
                comment=comment,
            )
        except IntegrityError:
            existing = Order.objects.get(idempotency_key=idempotency_key)
            return existing, False

        order_items = []
        for item in items:
            product = products[item["product_id"]]
            qty = item["quantity"]

            # Снимок итоговой цены на момент заказа. Если завтра акция
            # закончится или условие перестанет выполняться — цена
            # в оформленном заказе не изменится.
            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    quantity=qty,
                    unit_price=unit_prices[product.pk],
                )
            )

            Product.objects.filter(pk=product.pk).update(stock=F("stock") - qty)

        OrderItem.objects.bulk_create(order_items)

    return order, True


def restore_stock_for_order(order: Order) -> None:
    """
    Возвращает списанный stock по всем позициям заказа.

    Вызывается при отмене заказа (переход в статус "cancelled") и при
    удалении заказа — из сигналов в apps/orders/signals.py, которые сами
    проверяют order.stock_restored перед вызовом (эта функция ничего
    не проверяет и не помечает флаг — только увеличивает stock).

    F('stock') + qty — атомарная SQL-операция, не читает текущее
    значение в Python, поэтому безопасна при параллельных операциях
    с тем же товаром.
    """
    items = list(order.items.values("product_id", "quantity"))
    if not items:
        return

    product_ids = [i["product_id"] for i in items]

    with transaction.atomic():
        list(
            Product.objects.select_for_update(of=("self",)).filter(
                pk__in=product_ids
            )
        )

        for i in items:
            Product.objects.filter(pk=i["product_id"]).update(
                stock=F("stock") + i["quantity"]
            )