"""
Сериализаторы каталога.

Контракт с фронтом:
  - categorie (строка, не id) — намеренная опечатка фронта
  - final_price — НОВОЕ: итоговая цена с учётом активной акции.
    Считается на бэкенде (Product.current_price) — фронт НЕ должен
    сам вычислять скидку из price и discount, чтобы не разойтись
    в округлении с ценой заказа.
  - promoInfo: promo, eyebrow, title, description, discount, starts_at, ends_at
  - Поля только явным списком, никогда '__all__'
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

    # Итоговая цена с учётом скидки. source указывает на @property
    # Product.current_price — DRF умеет сериализовать property через source.
    # Формат совпадает с price (DecimalField, 2 знака) — фронту не нужно
    # ничего конвертировать, просто сравнить price != final_price для
    # отображения зачёркнутой цены.
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
        Собирает promoInfo из Promotion.
        discount — по-прежнему процент, для бейджа "-20%" на фронте.
        Реальная сумма скидки — в final_price на верхнем уровне ответа.
        select_related("promotion") во вьюхе исключает N+1.
        """
        empty: dict[str, Any] = {
            "promo": False,
            "eyebrow": "",
            "title": "",
            "description": "",
            "discount": 0,
            "starts_at": None,
            "ends_at": None,
        }

        try:
            promo: Promotion = obj.promotion
        except Promotion.DoesNotExist:
            return empty

        if not promo.is_active:
            return empty

        return {
            "promo": True,
            "eyebrow": promo.eyebrow,
            "title": promo.title,
            "description": promo.description,
            "discount": promo.discount,
            "starts_at": promo.starts_at.isoformat(),
            "ends_at": promo.ends_at.isoformat(),
        }
