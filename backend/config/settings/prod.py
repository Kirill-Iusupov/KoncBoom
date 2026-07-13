"""
Продакшн-настройки. DJANGO_SETTINGS_MODULE=config.settings.prod
"""

from decouple import Csv, config

from .base import *  # noqa: F401,F403
from .base import SPECTACULAR_SETTINGS

DEBUG = False

ENABLE_TLS = config("DJANGO_ENABLE_TLS", default=False, cast=bool)

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_SSL_REDIRECT = ENABLE_TLS
SESSION_COOKIE_SECURE = ENABLE_TLS
CSRF_COOKIE_SECURE = ENABLE_TLS

SECURE_HSTS_SECONDS = 31_536_000 if ENABLE_TLS else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = ENABLE_TLS
SECURE_HSTS_PRELOAD = ENABLE_TLS

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# Нужен для входа в Django Admin по HTTPS: без этого форма логина может
# дать 403 CSRF verification failed, т.к. Origin/Referer не совпадёт
# с ожидаемым Django по умолчанию.
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", default="", cast=Csv())

SPECTACULAR_SETTINGS["SERVE_INCLUDE_SCHEMA"] = False