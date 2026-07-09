"""
Модели заказов.

Ключевые архитектурные решения:
  - Покупатель — гость (имя, телефон, адрес), без регистрации и JWT
  - idempotency_key (uuid, unique) — защита от двойного сабмита при
    повторном POST (сеть упала, клиент ретраит)
  - OrderItem.unit_price фиксируется на момент покупки — не ссылка
    на текущую цену товара (цена могла измениться)
  - Списание stock происходит в сервисном слое (services.py) через
    transaction.atomic() + select_for_update() + F('stock') - qty
  - CHECK constraint stock >= 0 уже есть на уровне БД (миграция catalog)
"""

import uuid

from django.db import models

from apps.catalog.models import Product


class Order(models.Model):
    """Заказ гостя."""

    class Status(models.TextChoices):
        NEW = "new", "Новый"
        CONFIRMED = "confirmed", "Подтверждён"
        DONE = "done", "Выполнен"
        CANCELLED = "cancelled", "Отменён"

    # Уникальный ключ от клиента — защита от двойного сабмита.
    # Фронт генерирует UUID перед отправкой и повторяет его при ретрае.
    # Если заказ с таким ключом уже создан — возвращаем его, не создаём новый.
    idempotency_key: uuid.UUID = models.UUIDField(
        "Ключ идемпотентности",
        unique=True,
        default=uuid.uuid4,
        editable=False,
        db_index=True,
    )

    # --- Данные гостя ---
    guest_name: str = models.CharField("Имя", max_length=256)
    guest_phone: str = models.CharField("Телефон", max_length=32)
    guest_address: str = models.TextField("Адрес доставки")

    status: str = models.CharField(
        "Статус",
        max_length=16,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
    )

    comment: str = models.TextField("Комментарий", blank=True, default="")

    created_at: models.DateTimeField = models.DateTimeField(
        "Создан", auto_now_add=True
    )
    updated_at: models.DateTimeField = models.DateTimeField(
        "Обновлён", auto_now=True
    )

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Заказ #{self.pk} — {self.guest_name} ({self.get_status_display()})"


class OrderItem(models.Model):
    """Позиция в заказе."""

    order: Order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Заказ",
    )
    product: Product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,  # не даём удалить товар если он в заказе
        related_name="order_items",
        verbose_name="Товар",
    )
    quantity: int = models.PositiveIntegerField("Количество", default=1)

    # Цена фиксируется на момент создания заказа — snapshot.
    # Используем DecimalField, FloatField для денег запрещён архитектурно.
    unit_price: models.DecimalField = models.DecimalField(
        "Цена за единицу (KGS) на момент заказа",
        max_digits=10,
        decimal_places=2,
    )

    class Meta:
        verbose_name = "Позиция заказа"
        verbose_name_plural = "Позиции заказа"

    @property
    def total_price(self) -> models.DecimalField:
        """Итоговая стоимость позиции."""
        return self.unit_price * self.quantity

    def __str__(self) -> str:
        return f"{self.product.title} × {self.quantity}"
