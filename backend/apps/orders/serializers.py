"""
Сериализаторы заказов.

Правила:
  - fields — всегда явный список, никогда '__all__' (mass assignment)
  - Бизнес-логика (списание stock) — в services.py, НЕ здесь
  - Сериализатор только валидирует данные и формирует ответ
"""

import uuid
from decimal import Decimal
from typing import Any

from rest_framework import serializers

from apps.catalog.models import Product

from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    """Одна позиция во входящем запросе создания заказа."""

    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=999)

    def validate_product_id(self, value: int) -> int:
        """Проверяем, что товар существует и есть в наличии."""
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError(
                f"Товар с id={value} не найден."
            )
        return value


class OrderCreateSerializer(serializers.Serializer):
    """
    Входящий запрос создания заказа.

    idempotency_key генерируется на фронте (UUID v4) и передаётся
    в теле запроса. При ретрае фронт отправляет тот же ключ —
    сервис вернёт уже созданный заказ без повторного списания stock.
    """

    idempotency_key = serializers.UUIDField(default=uuid.uuid4)
    guest_name = serializers.CharField(max_length=256)
    guest_phone = serializers.CharField(max_length=32)
    guest_address = serializers.CharField()
    comment = serializers.CharField(required=False, allow_blank=True, default="")
    items = OrderItemInputSerializer(many=True, min_length=1)

    def validate_items(self, value: list[dict]) -> list[dict]:
        """Проверяем уникальность product_id в одном заказе."""
        product_ids = [item["product_id"] for item in value]
        if len(product_ids) != len(set(product_ids)):
            raise serializers.ValidationError(
                "В заказе не должно быть дублирующихся товаров. "
                "Объедините одинаковые позиции в одну."
            )
        return value


# --- Сериализаторы ответа ---

class OrderItemOutputSerializer(serializers.ModelSerializer):
    """Позиция заказа в ответе."""

    product_id = serializers.IntegerField(source="product.id")
    product_title = serializers.CharField(source="product.title")
    total_price = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "product_id",
            "product_title",
            "quantity",
            "unit_price",
            "total_price",
        ]


class OrderOutputSerializer(serializers.ModelSerializer):
    """Заказ в ответе после создания."""

    items = OrderItemOutputSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "idempotency_key",
            "guest_name",
            "guest_phone",
            "guest_address",
            "comment",
            "status",
            "status_display",
            "items",
            "created_at",
        ]
