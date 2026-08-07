"""
Кастомные throttle-классы поверх DRF ScopedRateThrottle.

Скоупы объявлены в REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]
(config/settings/base.py, переопределяются в dev.py).

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


class CartPreviewThrottle(ScopedRateThrottle):
    """
    Предпросмотр корзины (POST /api/orders/preview/).

    Лимит заметно выше, чем у создания заказа: фронт дёргает пересчёт
    при каждом изменении корзины (с debounce ~300мс), поэтому активный
    покупатель за минуту легко наберёт несколько десятков запросов.
    Операция дешёвая — только чтение, без записи и блокировок.
    """

    scope = "cart_preview"


class OrderCreateThrottle(ScopedRateThrottle):
    """
    Ограничивает частоту создания заказов с одного IP.
    Применяется на OrderCreateView.
    """

    scope = "order_create"