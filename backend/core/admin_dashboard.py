"""
Данные для стартовой страницы админки (Unfold DASHBOARD_CALLBACK)
и бейджа «Заказы» в сайдбаре.

Вся сводка собирается несколькими агрегирующими запросами и кладётся
в контекст шаблона templates/admin/index.html. Сбор обёрнут в try/except:
падение агрегации не должно ронять вход в админку — в худшем случае
показываем нулевую сводку, а не 500.
"""

from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from typing import Any

from django.db.models import Count, DecimalField, F, Sum
from django.db.models.functions import Coalesce
from django.http import HttpRequest
from django.urls import reverse
from django.utils import timezone

from apps.catalog.models import Product
from apps.orders.models import Order, OrderItem
from core.utils import format_kgs

# Товар с остатком <= порога считается «на исходе» и попадает в watchlist.
LOW_STOCK_THRESHOLD = 5
LOW_STOCK_LIMIT = 10
RECENT_ORDERS_LIMIT = 8
REVENUE_WINDOW_DAYS = 30

# Единые цвета статусов — используются на дашборде (список заказов
# показывает статус редактируемым селектом, там цвет не нужен).
STATUS_COLORS: dict[str, str] = {
    Order.Status.NEW: "#4f46e5",
    Order.Status.CONFIRMED: "#d97706",
    Order.Status.DONE: "#16a34a",
    Order.Status.CANCELLED: "#dc2626",
}

# Общий тип для денежных агрегатов (шире, чем поле цены товара, — сумма
# заказа может превысить max_digits одной позиции).
_MONEY = DecimalField(max_digits=14, decimal_places=2)


def new_orders_badge(request: HttpRequest) -> str:
    """Бейдж рядом с пунктом «Заказы» в сайдбаре: число новых заявок."""
    try:
        count = Order.objects.filter(status=Order.Status.NEW).count()
    except Exception:
        return ""
    # Пустая строка -> Unfold не рисует бейдж (не показываем «0»).
    return str(count) if count else ""


def dashboard_callback(
    request: HttpRequest, context: dict[str, Any]
) -> dict[str, Any]:
    """Наполняет контекст стартовой страницы админки сводкой."""
    try:
        context.update(_build_stats())
    except Exception:
        context.update(_empty_stats())
    return context


def _build_stats() -> dict[str, Any]:
    now = timezone.now()
    today = timezone.localtime(now).date()
    window_start = now - timedelta(days=REVENUE_WINDOW_DAYS)

    new_orders = Order.objects.filter(status=Order.Status.NEW).count()
    orders_today = Order.objects.filter(created_at__date=today).count()

    # Выручка = сумма выполненных заказов за окно. Coalesce -> 0, если пусто.
    revenue = OrderItem.objects.filter(
        order__status=Order.Status.DONE,
        order__created_at__gte=window_start,
    ).aggregate(
        total=Coalesce(
            Sum(F("unit_price") * F("quantity"), output_field=_MONEY),
            Decimal("0"),
            output_field=_MONEY,
        )
    )["total"]

    # Разбивка по статусам одним запросом (group by status).
    raw_counts = dict(
        Order.objects.values("status")
        .annotate(n=Count("id"))
        .values_list("status", "n")
    )
    total_orders = sum(raw_counts.values())
    status_rows = [
        {
            "label": label,
            "color": STATUS_COLORS.get(value, "#64748b"),
            "count": raw_counts.get(value, 0),
            "pct": (
                round(raw_counts.get(value, 0) / total_orders * 100)
                if total_orders
                else 0
            ),
        }
        for value, label in Order.Status.choices
    ]

    # Товары на исходе — один запрос, только нужные поля.
    low_stock = [
        {"title": title, "brand": brand, "stock": stock}
        for title, brand, stock in (
            Product.objects.filter(stock__lte=LOW_STOCK_THRESHOLD)
            .order_by("stock", "title")
            .values_list("title", "brand", "stock")[:LOW_STOCK_LIMIT]
        )
    ]

    # Последние заказы: сумма считается аннотацией, без N+1.
    recent_qs = Order.objects.annotate(
        total=Coalesce(
            Sum(F("items__unit_price") * F("items__quantity"), output_field=_MONEY),
            Decimal("0"),
            output_field=_MONEY,
        )
    ).order_by("-created_at")[:RECENT_ORDERS_LIMIT]
    status_labels = dict(Order.Status.choices)
    recent_orders = [
        {
            "id": order.pk,
            "name": order.guest_name,
            "status_label": status_labels.get(order.status, order.status),
            "status_color": STATUS_COLORS.get(order.status, "#64748b"),
            "total": format_kgs(order.total),
            "when": timezone.localtime(order.created_at).strftime("%d.%m %H:%M"),
        }
        for order in recent_qs
    ]

    orders_url = reverse("admin:orders_order_changelist")
    products_url = reverse("admin:catalog_product_changelist")

    return {
        "kb_new_orders": new_orders,
        "kb_orders_today": orders_today,
        "kb_revenue_30": format_kgs(revenue),
        "kb_revenue_days": REVENUE_WINDOW_DAYS,
        "kb_status_rows": status_rows,
        "kb_low_stock": low_stock,
        "kb_low_stock_threshold": LOW_STOCK_THRESHOLD,
        "kb_recent_orders": recent_orders,
        "kb_new_orders_url": f"{orders_url}?status__exact={Order.Status.NEW}",
        "kb_low_stock_url": products_url,
    }


def _empty_stats() -> dict[str, Any]:
    return {
        "kb_new_orders": 0,
        "kb_orders_today": 0,
        "kb_revenue_30": format_kgs(0),
        "kb_revenue_days": REVENUE_WINDOW_DAYS,
        "kb_status_rows": [],
        "kb_low_stock": [],
        "kb_low_stock_threshold": LOW_STOCK_THRESHOLD,
        "kb_recent_orders": [],
        "kb_new_orders_url": "",
        "kb_low_stock_url": "",
    }