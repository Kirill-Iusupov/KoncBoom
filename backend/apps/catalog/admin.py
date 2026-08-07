"""
Админка каталога.

Ключевые улучшения:
  - Unfold ModelAdmin (современный вид, тёмная тема).
  - Устранён N+1: количество товаров в категории — аннотацией Count(),
    признак акции — через list_select_related('promotion').
  - Промо-акция редактируется ТОЛЬКО инлайном внутри товара
    (связь один-к-одному), отдельного пункта меню больше нет.
  - final_price_display — итоговая цена с учётом БЕЗУСЛОВНОЙ скидки.
    Для условных акций показывает прочерк: цена зависит от корзины,
    в списке товаров её честно назвать нельзя.
  - ClickableRowAdminMixin — переход в объект по клику на всю строку.
  - Типы акций: поля условия показываются/прячутся по выбранному типу
    (static/admin/js/promotion_condition.js).
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
_PILL = (
    "display:inline-block;padding:2px 9px;border-radius:999px;"
    "font-size:12px;font-weight:600"
)


@admin.register(Category)
class CategoryAdmin(ClickableRowAdminMixin, ModelAdmin):
    list_display = ["icon_preview", "title", "product_count"]
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
    """
    Акция товара. Поля условия (min_quantity / required_product /
    required_quantity) показываются в зависимости от выбранного типа —
    за это отвечает promotion_condition.js, чтобы владелец магазина
    не видел десяток полей, из которых нужны два.
    """

    model = Promotion
    fk_name = "product"
    extra = 0
    verbose_name = "Акция"
    verbose_name_plural = "Акция"
    autocomplete_fields = ["required_product"]

    fieldsets = [
        (
            None,
            {
                "fields": [
                    "condition_type",
                    "discount",
                    "min_quantity",
                    "required_product",
                    "required_quantity",
                ]
            },
        ),
        (
            "Оформление",
            {"fields": ["eyebrow", "title", "description"]},
        ),
        (
            "Период",
            {"fields": ["starts_at", "ends_at"]},
        ),
    ]

    class Media:
        js = ["admin/js/promotion_condition.js"]


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

    def get_queryset(self, request: HttpRequest) -> QuerySet[Product]:
        # promotion__required_product нужен для подписи бейджа условной
        # акции — без него был бы запрос на каждую строку списка.
        return (
            super()
            .get_queryset(request)
            .select_related("promotion__required_product")
        )

    @admin.display(description="")
    def image_preview(self, obj: Product) -> str:
        if not obj.image:
            return format_html('<div style="{}"></div>', _THUMB_EMPTY)
        return format_html('<img src="{}" style="{}" />', obj.image.url, _THUMB)

    @admin.display(description="Итоговая цена")
    def final_price_display(self, obj: Product) -> str:
        """
        Цена с учётом безусловной акции. Для условных акций честный
        прочерк — итоговая цена зависит от корзины покупателя и в списке
        товаров не определена.
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
        promo = getattr(obj, "promotion", None)
        if promo is None:
            return mark_safe('<span style="opacity:.4">—</span>')

        if not promo.is_active:
            return format_html(
                '<span style="{};background:rgba(120,120,140,.15);'
                'color:inherit;opacity:.7">не активна</span>',
                _PILL,
            )

        if promo.is_unconditional:
            return format_html(
                '<span style="{};background:#dcfce7;color:#166534">−{}%</span>',
                _PILL,
                promo.discount,
            )

        # Условная акция — показываем и процент, и само условие,
        # чтобы владелец видел разницу прямо в списке.
        return format_html(
            '<span style="{};background:#fef3c7;color:#92400e">−{}%</span>'
            '<span style="display:block;font-size:11px;opacity:.65;'
            'margin-top:3px">{}</span>',
            _PILL,
            promo.discount,
            promo.condition_text,
        )