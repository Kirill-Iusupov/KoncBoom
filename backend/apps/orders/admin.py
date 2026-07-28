"""
Админка заказов.

Ключевые улучшения:
  - Unfold ModelAdmin.
  - Устранён N+1: число позиций и сумма заказа — аннотациями в get_queryset,
    а не .count()/суммой в цикле.
  - Убран дубль статуса. Оставлен один редактируемый селект — владелец
    меняет статус заявки прямо из списка (new -> confirmed -> done).
  - Добавлена колонка суммы заказа (в сомах) и навигация по датам.
  - Позиции заказа — только для чтения (снимок цены на момент покупки).
  - ClickableRowAdminMixin + расширенный list_display_links — переход
    в заказ теперь работает по клику на всю строку, а не только по id.
  - Возврат stock при отмене/удалении заказа — см. signals.py и
    services.restore_stock_for_order(). stock_restored показан в
    служебном разделе формы для прозрачности (виден администратору,
    но не редактируется).
"""

from __future__ import annotations

from decimal import Decimal

from django.contrib import admin
from django.db.models import Count, DecimalField, F, QuerySet, Sum
from django.db.models.functions import Coalesce
from django.http import HttpRequest
from django.utils.html import format_html

from unfold.admin import ModelAdmin, TabularInline

from core.admin import ClickableRowAdminMixin
from core.utils import format_kgs

from .models import Order, OrderItem

_MONEY = DecimalField(max_digits=14, decimal_places=2)


class OrderItemInline(TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ["product", "quantity", "unit_price", "line_total"]

    def has_add_permission(self, request: HttpRequest, obj=None) -> bool:
        # Состав заказа фиксируется при оформлении — вручную не добавляем.
        return False

    @admin.display(description="Сумма")
    def line_total(self, obj: OrderItem) -> str:
        return format_kgs(obj.total_price)


@admin.register(Order)
class OrderAdmin(ClickableRowAdminMixin, ModelAdmin):
    list_display = [
        "order_ref",
        "status",
        "order_total",
        "items_count",
        "guest_phone",
        "created_at",
    ]
    # Раньше был кликабелен только order_ref (по сути — id). Теперь клик
    # работает на всю строку через ClickableRowAdminMixin — эти колонки
    # определяют КУДА ведёт ссылка (Django требует хотя бы одну), но
    # фактическая кликабельная область — вся строка целиком.
    list_display_links = ["order_ref", "order_total", "items_count", "guest_phone", "created_at"]
    list_editable = ["status"]  # смена статуса заявки прямо из списка
    list_filter = ["status", "created_at"]
    search_fields = ["guest_name", "guest_phone", "guest_address"]
    readonly_fields = ["idempotency_key", "created_at", "updated_at", "stock_restored"]
    date_hierarchy = "created_at"
    ordering = ["-created_at"]
    inlines = [OrderItemInline]

    fieldsets = [
        ("Статус", {"fields": ["status"]}),
        (
            "Данные гостя",
            {"fields": ["guest_name", "guest_phone", "guest_address", "comment"]},
        ),
        (
            "Служебное",
            {
                "fields": [
                    "idempotency_key",
                    "stock_restored",
                    "created_at",
                    "updated_at",
                ],
                "classes": ["collapse"],
            },
        ),
    ]

    def get_queryset(self, request: HttpRequest) -> QuerySet[Order]:
        return (
            super()
            .get_queryset(request)
            .annotate(
                _items_count=Count("items"),
                _items_total=Coalesce(
                    Sum(
                        F("items__unit_price") * F("items__quantity"),
                        output_field=_MONEY,
                    ),
                    Decimal("0"),
                    output_field=_MONEY,
                ),
            )
        )

    @admin.display(description="Заказ")
    def order_ref(self, obj: Order) -> str:
        return format_html(
            "<strong>#{}</strong><br><span style='opacity:.6'>{}</span>",
            obj.pk,
            obj.guest_name,
        )

    @admin.display(description="Сумма", ordering="_items_total")
    def order_total(self, obj: Order) -> str:
        return format_kgs(obj._items_total)

    @admin.display(description="Позиций", ordering="_items_count")
    def items_count(self, obj: Order) -> int:
        return obj._items_count