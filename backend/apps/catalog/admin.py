"""
Админка каталога.

Ключевые улучшения:
  - Unfold ModelAdmin (современный вид, тёмная тема).
  - Устранён N+1: количество товаров в категории — аннотацией Count(),
    признак акции — через list_select_related('promotion').
  - Промо-акция редактируется ТОЛЬКО инлайном внутри товара
    (связь один-к-одному), отдельного пункта меню больше нет.
  - В списке товаров: превью картинки, бейдж активной акции,
    фильтр «на акции сейчас». Быстрое редактирование цены/остатка/
    популярности прямо в списке сохранено.
  - final_price_display — итоговая цена с учётом скидки (Product.current_price),
    видна прямо в списке рядом с обычной ценой. Формат — format_kgs()
    (общий хелпер "1 234 сом"), раньше здесь было "{} KGS" — несогласованно
    с остальной админкой (заказы уже использовали сом).
  - ClickableRowAdminMixin + расширенный list_display_links — переход
    в объект по клику на всю строку, а не только по узкой ссылке.
"""

from __future__ import annotations

from django.contrib import admin
from django.db.models import Count, QuerySet
from django.http import HttpRequest
from django.utils import timezone
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from unfold.admin import ModelAdmin, StackedInline

from core.admin import ClickableRowAdminMixin
from core.utils import format_kgs

from .models import Category, Product, Promotion

_THUMB = "height:40px;width:40px;object-fit:cover;border-radius:8px"
_THUMB_EMPTY = (
    "height:40px;width:40px;border-radius:8px;"
    "border:1px dashed rgba(120,120,140,.5)"
)
_ICO = "height:30px;width:30px;object-fit:contain"
_PILL = "display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600"


@admin.register(Category)
class CategoryAdmin(ClickableRowAdminMixin, ModelAdmin):
    list_display = ["icon_preview", "title", "product_count"]
    # Ни одно поле не в list_editable — можно сделать кликабельными все
    # колонки. Фактическая область клика — вся строка (ClickableRowAdminMixin).
    list_display_links = ["icon_preview", "title", "product_count"]
    search_fields = ["title"]
    prepopulated_fields = {"slug": ("title",)}
    fields = ["title", "slug", "description", "icon"]

    def get_queryset(self, request: HttpRequest) -> QuerySet[Category]:
        return super().get_queryset(request).annotate(_product_count=Count("products"))

    @admin.display(description="Товаров", ordering="_product_count")
    def product_count(self, obj: Category) -> int:
        return obj._product_count

    @admin.display(description="")
    def icon_preview(self, obj: Category) -> str:
        if not obj.icon:
            return mark_safe('<span style="opacity:.4">—</span>')
        return format_html('<img src="{}" style="{}" />', obj.icon.url, _ICO)


class OnSaleFilter(admin.SimpleListFilter):
    """Фильтр «на акции сейчас» — по датам активной промо-акции."""

    title = "Акция"
    parameter_name = "on_sale"

    def lookups(self, request, model_admin):
        return [("yes", "На акции сейчас"), ("no", "Без активной акции")]

    def queryset(self, request, queryset):
        now = timezone.now()
        active = {
            "promotion__starts_at__lte": now,
            "promotion__ends_at__gte": now,
        }
        if self.value() == "yes":
            return queryset.filter(**active)
        if self.value() == "no":
            return queryset.exclude(**active)
        return queryset


class PromotionInline(StackedInline):
    model = Promotion
    extra = 0
    verbose_name = "Акция"
    verbose_name_plural = "Акция"
    fields = ["eyebrow", "title", "description", "discount", "starts_at", "ends_at"]


@admin.register(Product)
class ProductAdmin(ClickableRowAdminMixin, ModelAdmin):
    list_display = [
        "image_preview",
        "title",
        "brand",
        "category",
        "price",
        "final_price_display",
        "stock",
        "popular",
        "promo_badge",
    ]
    # price, stock, popular — в list_editable, их нельзя одновременно
    # включить в list_display_links (ограничение Django). Остальные
    # колонки кликабельны, а благодаря ClickableRowAdminMixin реально
    # кликабельна вся строка целиком.
    list_display_links = [
        "image_preview",
        "title",
        "brand",
        "category",
        "final_price_display",
        "promo_badge",
    ]
    list_editable = ["price", "stock", "popular"]
    list_filter = [OnSaleFilter, "category", "popular"]
    search_fields = ["title", "brand"]
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ["category"]
    list_select_related = ["category", "promotion"]
    inlines = [PromotionInline]
    fieldsets = [
        ("Товар", {"fields": ["brand", "title", "slug", "category", "image"]}),
        ("Цена и склад", {"fields": ["price", "stock", "popular"]}),
    ]

    @admin.display(description="")
    def image_preview(self, obj: Product) -> str:
        if not obj.image:
            return format_html('<div style="{}"></div>', _THUMB_EMPTY)
        return format_html('<img src="{}" style="{}" />', obj.image.url, _THUMB)

    @admin.display(description="Итоговая цена")
    def final_price_display(self, obj: Product) -> str:
        """
        Показывает Product.current_price — ту же цену, что видит покупатель
        на сайте (final_price в API) и что зафиксируется в заказе.
        Если акция не активна — совпадает с обычной price, выделение не нужно.
        """
        current = obj.current_price
        if current == obj.price:
            return mark_safe('<span style="opacity:.4">—</span>')
        return format_html(
            '<span style="{};background:#dcfce7;color:#166534">{}</span>',
            _PILL,
            format_kgs(current),
        )

    @admin.display(description="Акция")
    def promo_badge(self, obj: Product) -> str:
        try:
            promo = obj.promotion
        except Promotion.DoesNotExist:
            return mark_safe('<span style="opacity:.4">—</span>')
        if promo.is_active:
            return format_html(
                '<span style="{};background:#dcfce7;color:#166534">−{}%</span>',
                _PILL,
                promo.discount,
            )
        return format_html(
            '<span style="{};background:rgba(120,120,140,.15);color:inherit;opacity:.7">'
            "не активна</span>",
            _PILL,
        )