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

Скидки:
  - unit_price фиксируется через Product.current_price (учитывает активную
    Promotion), а не через "голую" Product.price. current_price — единая
    точка расчёта, та же, что используется в API (ProductSerializer.final_price).

select_for_update() + select_related("promotion"):
  - Promotion — необязательная обратная OneToOne-связь (не у каждого товара
    есть акция), поэтому select_related строит LEFT OUTER JOIN.
    PostgreSQL запрещает `SELECT ... FOR UPDATE` поверх LEFT OUTER JOIN,
    решение — of=("self",): блокируем FOR UPDATE только таблицу Product.

Возврат stock (restore_stock_for_order):
  - Вызывается из apps/orders/signals.py при отмене заказа (смена статуса
    на "cancelled") и при удалении заказа (админка, ORM). Используем
    F('stock') + qty — тот же атомарный паттерн, что и при списании,
    чтобы не потерять инкремент при параллельном заказе того же товара.
  - Идемпотентность обеспечивает вызывающий код (сигналы проверяют
    order.stock_restored перед вызовом) — сама функция это не проверяет.
"""

import uuid
from decimal import Decimal
from typing import Any

from django.db import IntegrityError, transaction
from django.db.models import F

from apps.catalog.models import Product

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
        products: dict[int, Product] = {
            p.pk: p
            for p in Product.objects.select_related("promotion")
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
            unit_price: Decimal = product.current_price

            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    quantity=qty,
                    unit_price=unit_price,
                )
            )

            Product.objects.filter(pk=product.pk).update(
                stock=F("stock") - qty
            )

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
    с тем же товаром (например, кто-то оформляет новый заказ в этот
    момент).
    """
    items = list(order.items.values("product_id", "quantity"))
    if not items:
        return

    product_ids = [i["product_id"] for i in items]

    with transaction.atomic():
        # Блокируем строки товаров перед инкрементом — тот же паттерн,
        # что и в create_order, но в обратную сторону (+qty вместо -qty).
        # of=("self",) не обязателен здесь (нет select_related), но оставлен
        # для единообразия с create_order на случай будущих правок.
        list(
            Product.objects.select_for_update(of=("self",)).filter(
                pk__in=product_ids
            )
        )

        for i in items:
            Product.objects.filter(pk=i["product_id"]).update(
                stock=F("stock") + i["quantity"]
            )