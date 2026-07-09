"""
Настройки для локальной разработки.
Запускать с DJANGO_SETTINGS_MODULE=config.settings.dev (значение по умолчанию).
"""

from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

# В dev разрешаем фронту стучаться с localhost без .env-настройки origin,
# если CORS_ALLOWED_ORIGINS не задан явно.
if not CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Swagger UI и schema доступны только в dev/staging по умолчанию.
SPECTACULAR_SETTINGS["SERVE_INCLUDE_SCHEMA"] = True  # noqa: F405

# Более мягкий rate limit в dev, чтобы не мешать ручному тестированию.
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {  # noqa: F405
    "order_create": "100/min",
    "catalog_read": "1000/min",
}
