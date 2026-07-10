"""
Сериализаторы каталога.

Контракт с фронтом строго соблюдается:
  - categorie (строка, не id) — фронт ждёт именно это поле с опечаткой
  - promoInfo — вложенный объект, promo вычисляется по датам Promotion
  - Поля только явным списком, никогда '__all__' (защита от mass assignment)
"""

from typing import Any

from rest_framework import serializers

from .models import Category, Product, Promotion


class CategorySerializer(serializers.ModelSerializer):
    """
    Сериализатор категории.
    count — аннотация из get_queryset (Count продуктов), не поле модели.
    icon  — полный URL файла иконки (SVG/PNG), аналогично image у Product.
    """

    count = serializers.IntegerField(read_only=True)
    # icon через SerializerMethodField — FileField.url возвращает относительный
    # путь, без request.build_absolute_uri фронт получит "/media/..." без домена.
    icon = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "title", "slug", "description", "icon", "count"]

    def get_icon(self, obj: Category) -> str:
        """Возвращает абсолютный URL иконки или пустую строку."""
        if not obj.icon:
            return ""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.icon.url)
        return obj.icon.url


class PromoInfoSerializer(serializers.Serializer):
    """
    Вложенный объект promoInfo в ответе по товару.
    promo — вычисляемый флаг (starts_at <= now <= ends_at), не хранится в БД.
    """

    promo = serializers.BooleanField()
    eyebrow = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    discount = serializers.IntegerField()
    url = serializers.CharField()


class ProductSerializer(serializers.ModelSerializer):
    """
    Сериализатор товара.

    Особенности контракта:
      - categorie (строка, не id) — намеренная опечатка из фронта
      - image — полный URL через SerializerMethodField
      - promoInfo — вложенный объект из Promotion или заглушка
    """

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
        """Возвращает абсолютный URL изображения или пустую строку."""
        if not obj.image:
            return ""
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_promoInfo(self, obj: Product) -> dict[str, Any]:
        """
        Собирает promoInfo из связанной Promotion.
        Если акции нет или она неактивна — возвращает заглушку с promo=False.
        select_related("promotion") во вьюхе исключает N+1.
        """
        empty: dict[str, Any] = {
            "promo": False,
            "eyebrow": "",
            "title": "",
            "description": "",
            "discount": 0,
            "url": "",
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
            "url": promo.url,
        }