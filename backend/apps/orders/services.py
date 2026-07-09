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
    # Быстрая проверка на дубль ДО открытия транзакции — экономим блокировки.
    try:
        existing = Order.objects.get(idempotency_key=idempotency_key)
        return existing, False
    except Order.DoesNotExist:
        pass

    product_ids = [item["product_id"] for item in items]

    with transaction.atomic():
        # select_for_update() блокирует строки товаров до конца транзакции.
        # Другие параллельные транзакции будут ждать снятия блокировки.
        # nowait=False (дефолт) — ждём, не бросаем исключение сразу.
        products: dict[int, Product] = {
            p.pk: p
            for p in Product.objects.select_for_update().filter(pk__in=product_ids)
        }

        # Проверяем наличие всех товаров
        for item in items:
            pid = item["product_id"]
            if pid not in products:
                raise Product.DoesNotExist(f"Товар с id={pid} не найден.")

        # Проверяем stock ДО списания — даём понятную ошибку клиенту
        for item in items:
            product = products[item["product_id"]]
            qty = item["quantity"]
            if product.stock < qty:
                raise InsufficientStockError(
                    product_title=product.title,
                    available=product.stock,
                    requested=qty,
                )

        # Создаём заказ
        try:
            order = Order.objects.create(
                idempotency_key=idempotency_key,
                guest_name=guest_name,
                guest_phone=guest_phone,
                guest_address=guest_address,
                comment=comment,
            )
        except IntegrityError:
            # Гонка: между нашей проверкой выше и созданием другой запрос
            # с тем же ключом успел создать заказ. Возвращаем существующий.
            existing = Order.objects.get(idempotency_key=idempotency_key)
            return existing, False

        # Создаём позиции и списываем stock атомарно через F-выражение.
        # F('stock') - qty выполняется как UPDATE ... SET stock = stock - qty
        # прямо в SQL — Python-уровень не читает текущее значение stock,
        # поэтому нет window между SELECT и UPDATE (TOCTOU race condition).
        order_items = []
        for item in items:
            product = products[item["product_id"]]
            qty = item["quantity"]

            # Фиксируем цену на момент заказа (snapshot)
            unit_price: Decimal = product.price

            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    quantity=qty,
                    unit_price=unit_price,
                )
            )

            # Атомарное списание — CHECK constraint stock>=0 на уровне БД
            # является последним рубежом защиты от ухода в минус.
            Product.objects.filter(pk=product.pk).update(
                stock=F("stock") - qty
            )

        OrderItem.objects.bulk_create(order_items)

    return order, True
