from django.contrib import admin
from django.utils.html import format_html

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product", "quantity", "unit_price", "total_price_display"]
    can_delete = False

    @admin.display(description="Сумма")
    def total_price_display(self, obj: OrderItem) -> str:
        return f"{obj.total_price:,.2f} KGS"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "guest_name",
        "guest_phone",
        "status_badge",
        "created_at",
        "items_count",
    ]
    list_filter = ["status", "created_at"]
    search_fields = ["guest_name", "guest_phone", "guest_address"]
    readonly_fields = ["idempotency_key", "created_at", "updated_at"]
    list_editable = ["status"]  # быстрая смена статуса прямо в списке
    inlines = [OrderItemInline]
    ordering = ["-created_at"]

    fieldsets = [
        (
            "Данные гостя",
            {"fields": ["guest_name", "guest_phone", "guest_address", "comment"]},
        ),
        (
            "Статус",
            {"fields": ["status"]},
        ),
        (
            "Служебное",
            {
                "fields": ["idempotency_key", "created_at", "updated_at"],
                "classes": ["collapse"],
            },
        ),
    ]

    @admin.display(description="Статус")
    def status_badge(self, obj: Order) -> str:
        colors = {
            "new": "#1677ff",
            "confirmed": "#faad14",
            "done": "#52c41a",
            "cancelled": "#ff4d4f",
        }
        color = colors.get(obj.status, "#999")
        return format_html(
            '<span style="color:{};font-weight:bold">{}</span>',
            color,
            obj.get_status_display(),
        )

    @admin.display(description="Позиций")
    def items_count(self, obj: Order) -> int:
        return obj.items.count()
