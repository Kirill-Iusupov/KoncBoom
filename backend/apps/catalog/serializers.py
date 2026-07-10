"""
Сериализаторы каталога.

Контракт с фронтом:
  - categorie (строка, не id) — намеренная опечатка фронта
  - promoInfo: promo, eyebrow, title, description, discount, starts_at, ends_at
  - url убран из Promotion и из promoInfo — промо-страниц в проекте нет
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
        """Абсолютный URL иконки или пустая строка."""
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

    class Meta:
        model = Product
        fields = [
            "id",
            "brand",
            "title",
            "slug",
            "price",
            "categorie",
            "image",
            "popular",
            "stock",
            "promoInfo",
        ]

    def get_image(self, obj: Product) -> str:
        """Абсолютный URL изображения или пустая строка."""
        if not obj.image:
            return ""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_promoInfo(self, obj: Product) -> dict[str, Any]:
        """
        Собирает promoInfo из Promotion.
        Возвращает даты starts_at/ends_at в ISO 8601 (строка).
        Если акции нет или она неактивна — promo=False, даты null.
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
            # ISO 8601 — фронт может отформатировать как угодно
            "starts_at": promo.starts_at.isoformat(),
            "ends_at": promo.ends_at.isoformat(),
        }
