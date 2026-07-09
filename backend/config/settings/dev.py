"""
Настройки для локальной разработки.
Запускать с DJANGO_SETTINGS_MODULE=config.settings.dev (значение по умолчанию).
"""

from .base import *  # noqa: F401,F403
from .base import CORS_ALLOWED_ORIGINS, REST_FRAMEWORK, SPECTACULAR_SETTINGS

DEBUG = True

ALLOWED_HOSTS = ["*"]

# В dev разрешаем фронту стучаться с localhost без .env-настройки,
# если CORS_ALLOWED_ORIGINS пуст (например, при первом запуске).
if not CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Swagger UI доступен в dev по /api/docs/
SPECTACULAR_SETTINGS["SERVE_INCLUDE_SCHEMA"] = True

# Более мягкий rate limit в dev — не мешает ручному тестированию
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {
    "order_create": "100/min",
    "catalog_read": "1000/min",
}
