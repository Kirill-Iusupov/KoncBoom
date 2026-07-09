"""
Вьюхи заказов.

View — только маршрутизация, валидация через сериализатор и ответ клиенту.
Вся бизнес-логика (atomic, stock, idempotency) — в services.py.
"""

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.throttles import OrderCreateThrottle

from .models import Order
from .serializers import OrderCreateSerializer, OrderOutputSerializer
from .services import InsufficientStockError, create_order


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
            # Непредвиденная ошибка — не роняем сервер, возвращаем 500
            return Response(
                {"error": "internal_error", "detail": "Не удалось создать заказ."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        out_serializer = OrderOutputSerializer(
            order,
            context={"request": request},
        )
        http_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(out_serializer.data, status=http_status)
