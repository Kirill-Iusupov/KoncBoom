"""
Продакшн-настройки.
Запускать с DJANGO_SETTINGS_MODULE=config.settings.prod.
"""

from decouple import Csv, config

from .base import *  # noqa: F401,F403

DEBUG = False

ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", cast=Csv())

# --- Безопасность транспорта ---
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 31536000  # 1 год
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# Реальный TLS терминируется на Nginx, но Django должен доверять
# заголовку X-Forwarded-Proto от reverse proxy.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# --- Swagger UI отключаем на публичном проде (по желанию можно включить) ---
SPECTACULAR_SETTINGS["SERVE_INCLUDE_SCHEMA"] = False  # noqa: F405
