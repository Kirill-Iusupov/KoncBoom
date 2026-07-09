from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, Promotion


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "icon", "product_count"]
    search_fields = ["title", "slug"]
    prepopulated_fields = {"slug": ("title",)}

    @admin.display(description="Товаров")
    def product_count(self, obj: Category) -> int:
        return obj.products.count()


class PromotionInline(admin.StackedInline):
    """Акция редактируется прямо на странице товара."""

    model = Promotion
    extra = 0
    fields = ["eyebrow", "title", "description", "discount", "url", "starts_at", "ends_at"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "brand",
        "category",
        "price",
        "stock",
        "popular",
        "promo_status",
    ]
    list_filter = ["category", "popular"]
    search_fields = ["title", "brand", "slug"]
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ["popular", "stock", "price"]
    inlines = [PromotionInline]
    readonly_fields = ["slug"]

    @admin.display(description="Акция активна", boolean=True)
    def promo_status(self, obj: Product) -> bool:
        """Показывает активность акции прямо в списке товаров."""
        try:
            return obj.promotion.is_active
        except Promotion.DoesNotExist:
            return False


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ["product", "title", "discount", "starts_at", "ends_at", "is_active_display"]
    list_filter = ["starts_at", "ends_at"]
    search_fields = ["product__title", "title"]

    @admin.display(description="Активна", boolean=True)
    def is_active_display(self, obj: Promotion) -> bool:
        return obj.is_active
