"""
Кастомные throttle-классы поверх DRF ScopedRateThrottle.

Базовые скоупы (order_create, catalog_read) объявлены в
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] (config/settings/base.py).

Хранилище счётчиков — Redis (django_redis, см. CACHES в base.py).
Это первый рубеж rate limiting; второй — limit_req в Nginx.
"""

from rest_framework.throttling import ScopedRateThrottle


class CatalogReadThrottle(ScopedRateThrottle):
    """
    Ограничивает частоту чтения каталога с одного IP.
    Применяется на CategoryViewSet и ProductViewSet.
    """

    scope = "catalog_read"


class OrderCreateThrottle(ScopedRateThrottle):
    """
    Ограничивает частоту создания заказов с одного IP.
    Применяется на OrderCreateView (PR#3).
    """

    scope = "order_create"
