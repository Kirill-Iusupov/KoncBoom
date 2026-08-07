"""
Вьюхи заказов.

View — только маршрутизация, валидация через сериализатор и ответ клиенту.
Вся бизнес-логика (atomic, stock, idempotency) — в services.py,
расчёт цен — в apps.catalog.pricing.
"""

import logging

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.pricing import PricedCart, price_cart

from core.throttles import CartPreviewThrottle, OrderCreateThrottle

from .serializers import (
    CartPreviewSerializer,
    OrderCreateSerializer,
    OrderOutputSerializer,
)
from .services import InsufficientStockError, create_order

logger = logging.getLogger(__name__)


def _serialize_cart(cart: PricedCart) -> dict:
    """
    Превращает результат движка цен в JSON-ответ.

    Формат осознанно «плоский» и посчитанный: фронт не должен ничего
    домножать или складывать сам, иначе его арифметика начнёт расходиться
    с серверной (а сервер — авторитетный источник при оформлении заказа).
    """
    return {
        "items": [
            {
                "product_id": line.product.pk,
                "title": line.product.title,
                "slug": line.product.slug,
                "quantity": line.quantity,
                "stock": line.product.stock,
                # Хватает ли остатка — чтобы фронт мог подсветить позицию
                # до того, как оформление упадёт с 409.
                "stock_ok": line.product.stock >= line.quantity,
                "unit_price": str(line.unit_price),
                "final_unit_price": str(line.final_unit_price),
                "line_total": str(line.line_total),
                "line_discount": str(line.line_discount),
                "has_discount": line.has_discount,
                "applied_promo": (
                    {
                        "title": line.promo.title,
                        "discount": line.promo.discount,
                        "condition_type": line.promo.condition_type,
                    }
                    if line.promo
                    else None
                ),
                "hint": line.hint,
            }
            for line in cart.lines
        ],
        "subtotal": str(cart.subtotal),
        "discount_total": str(cart.discount_total),
        "total": str(cart.total),
    }


class CartPreviewView(APIView):
    """
    POST /api/orders/preview/
    Предпросмотр корзины: считает цены с учётом условных акций.

    Ничего не создаёт, ничего не блокирует, склад не трогает.
    Фронт дёргает это при каждом изменении корзины (с debounce).
    """

    throttle_classes = [CartPreviewThrottle]

    @extend_schema(
        summary="Рассчитать корзину",
        tags=["Заказы"],
        request=CartPreviewSerializer,
        responses={200: None, 400: None},
    )
    def post(self, request: Request) -> Response:
        serializer = CartPreviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cart = price_cart(serializer.validated_data["items"])
        except Exception:
            logger.exception("Не удалось рассчитать корзину")
            return Response(
                {
                    "error": "internal_error",
                    "detail": "Не удалось рассчитать корзину.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(_serialize_cart(cart), status=status.HTTP_200_OK)


class OrderCreateView(APIView):
    """
    POST /api/orders/
    Создание гостевого заказа.

    Идемпотентно: повторный запрос с тем же idempotency_key
    вернёт уже созданный заказ со статусом 200 (не 201).
    """

    throttle_classes = [OrderCreateThrottle]

    @extend_schema(
        summary="Создать заказ",
        tags=["Заказы"],
        request=OrderCreateSerializer,
        responses={
            201: OrderOutputSerializer,
            200: OrderOutputSerializer,
            400: None,
            409: None,
        },
    )
    def post(self, request: Request) -> Response:
        in_serializer = OrderCreateSerializer(data=request.data)
        in_serializer.is_valid(raise_exception=True)
        data = in_serializer.validated_data

        try:
            order, created = create_order(
                idempotency_key=data["idempotency_key"],
                guest_name=data["guest_name"],
                guest_phone=data["guest_phone"],
                guest_address=data["guest_address"],
                comment=data.get("comment", ""),
                items=data["items"],
            )
        except InsufficientStockError as e:
            # 409 Conflict — клиент должен обновить корзину и повторить
            return Response(
                {
                    "error": "insufficient_stock",
                    "detail": str(e),
                    "product": e.product_title,
                    "available": e.available,
                    "requested": e.requested,
                },
                status=status.HTTP_409_CONFLICT,
            )
        except Exception:
            logger.exception(
                "Не удалось создать заказ (idempotency_key=%s)",
                data.get("idempotency_key"),
            )
            return Response(
                {"error": "internal_error", "detail": "Не удалось создать заказ."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        out_serializer = OrderOutputSerializer(order, context={"request": request})
        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(out_serializer.data, status=http_status)