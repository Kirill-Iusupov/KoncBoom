"""
Сериализаторы каталога.

Контракт с фронтом:
  - categorie (строка, не id) — намеренная опечатка фронта
  - final_price — цена с учётом БЕЗУСЛОВНОЙ акции (Product.current_price).
    Условные акции сюда не попадают: их нельзя посчитать без корзины,
    для них есть POST /api/orders/preview/.
  - promoInfo расширен полями условия (см. get_promoInfo).
  - Поля только явным списком, никогда '__all__'

Обратная совместимость promoInfo.promo:
  promo=True означает «скидка УЖЕ применена к final_price» — то есть
  только для безусловных акций. Для условной акции promo=False,
  а conditional=True. Так старый фронт, который умеет только
  зачёркивать price при promo=True, не покажет одинаковые цены
  дважды, а новый — отрисует плашку с условием по conditional.
"""

from typing import Any

from rest_framework import serializers

from .models import Category, Product, Promotion


class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(read_only=True)
    icon = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "title", "slug", "description", "icon", "count"]

    def get_icon(self, obj: Category) -> str:
        if not obj.icon:
            return ""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.icon.url)
        return obj.icon.url


class ProductSerializer(serializers.ModelSerializer):
    categorie = serializers.CharField(source="category.title", read_only=True)
    image = serializers.SerializerMethodField()
    promoInfo = serializers.SerializerMethodField()

    final_price = serializers.DecimalField(
        source="current_price",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "brand",
            "title",
            "slug",
            "price",
            "final_price",
            "categorie",
            "image",
            "popular",
            "stock",
            "promoInfo",
        ]

    def get_image(self, obj: Product) -> str:
        if not obj.image:
            return ""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_promoInfo(self, obj: Product) -> dict[str, Any]:
        """
        Данные акции для карточки товара.

        promo       — скидка уже в final_price (безусловная акция)
        conditional — акция активна, но сработает только в корзине
        condition_text — готовая строка для плашки («От 10 шт — скидка 15%»)

        select_related("promotion", "promotion__required_product") во вьюхе
        исключает N+1.
        """
        empty: dict[str, Any] = {
            "promo": False,
            "conditional": False,
            "condition_type": "",
            "condition_text": "",
            "min_quantity": None,
            "required_product": None,
            "required_quantity": None,
            "eyebrow": "",
            "title": "",
            "description": "",
            "discount": 0,
            "starts_at": None,
            "ends_at": None,
        }

        promo: Promotion | None = getattr(obj, "promotion", None)
        if promo is None or not promo.is_active:
            return empty

        unconditional = promo.is_unconditional

        required_product = None
        if promo.required_product_id and promo.required_product:
            required_product = {
                "id": promo.required_product.id,
                "title": promo.required_product.title,
                "slug": promo.required_product.slug,
            }

        return {
            # True только если цена в final_price уже снижена
            "promo": unconditional,
            "conditional": not unconditional,
            "condition_type": promo.condition_type,
            "condition_text": promo.condition_text,
            "min_quantity": promo.min_quantity,
            "required_product": required_product,
            "required_quantity": (
                promo.required_quantity
                if promo.condition_type == Promotion.ConditionType.REQUIRES_PRODUCT
                else None
            ),
            "eyebrow": promo.eyebrow,
            "title": promo.title,
            "description": promo.description,
            "discount": promo.discount,
            "starts_at": promo.starts_at.isoformat(),
            "ends_at": promo.ends_at.isoformat(),
        }