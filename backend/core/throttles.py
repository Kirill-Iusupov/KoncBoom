"""
Кастомные throttle-классы поверх DRF ScopedRateThrottle.

Базовые скоупы (order_create, catalog_read) уже объявлены в
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] (config/settings/base.py).
Здесь — точечные классы для случаев, где нужен нестандартный ключ
идентификации клиента (например, по IP, а не по сессии).
"""

from rest_framework.throttling import ScopedRateThrottle


class OrderCreateThrottle(ScopedRateThrottle):
    """
    Ограничивает частоту создания заказов с одного IP.
    Это первый рубеж защиты (второй — limit_req в Nginx).
    """

    scope = "order_create"
