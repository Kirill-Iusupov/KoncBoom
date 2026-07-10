"""
Вьюхи каталога.

Правила архитектуры:
  - Views — только маршрутизация и сериализация ответа (логика — в сериализаторах)
  - select_related / prefetch_related — ВСЕГДА в get_queryset, иначе N+1
  - throttle_scope подключается точечно здесь, а не глобально
"""

from django.db.models import Count, QuerySet
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin

from core.throttles import CatalogReadThrottle

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


@extend_schema_view(
    list=extend_schema(summary="Список категорий", tags=["Каталог"]),
    retrieve=extend_schema(summary="Категория по slug", tags=["Каталог"]),
)
class CategoryViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    """
    Категории товаров.
    count — аннотация: ВСЕ товары в категории, независимо от stock.
    """

    serializer_class = CategorySerializer
    lookup_field = "slug"
    throttle_classes = [CatalogReadThrottle]

    def get_queryset(self) -> QuerySet[Category]:
        # Count("products") без фильтра — считаем ВСЕ товары категории.
        # Старый фильтр Q(products__stock__gt=0) давал count=0 для всех
        # товаров с дефолтным stock=0.
        return Category.objects.annotate(count=Count("products")).order_by("title")


@extend_schema_view(
    list=extend_schema(
        summary="Список товаров",
        tags=["Каталог"],
        parameters=[
            OpenApiParameter(
                name="category",
                description="Фильтр по slug категории",
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name="popular",
                description="Только популярные товары (true/false)",
                required=False,
                type=bool,
            ),
            OpenApiParameter(
                name="in_stock",
                description="Только товары в наличии (true/false)",
                required=False,
                type=bool,
            ),
        ],
    ),
    retrieve=extend_schema(summary="Товар по slug", tags=["Каталог"]),
)
class ProductViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    """
    Товары каталога.
    Поддерживает фильтрацию по категории, популярности, наличию.
    """

    serializer_class = ProductSerializer
    lookup_field = "slug"
    throttle_classes = [CatalogReadThrottle]

    def get_queryset(self) -> QuerySet[Product]:
        """
        select_related("category", "promotion") — один SQL-запрос вместо N+1.
        Сериализатор обращается к obj.category.title и obj.promotion —
        без select_related оба поля дали бы отдельный запрос на каждый товар.
        """
        qs = Product.objects.select_related("category", "promotion").order_by(
            "-popular", "title"
        )

        category_slug = self.request.query_params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        popular = self.request.query_params.get("popular")
        if popular is not None:
            qs = qs.filter(popular=popular.lower() == "true")

        in_stock = self.request.query_params.get("in_stock")
        if in_stock is not None and in_stock.lower() == "true":
            qs = qs.filter(stock__gt=0)

        return qs