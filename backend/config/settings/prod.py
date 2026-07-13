"""
Продакшн-настройки. DJANGO_SETTINGS_MODULE=config.settings.prod

Чеклист перед деплоем:
  - DEBUG=False (здесь, не через .env)
  - DJANGO_SECRET_KEY — длинная случайная строка
  - DJANGO_ALLOWED_HOSTS — реальный IP (фаза 1) или домен (фаза 2)
  - CORS_ALLOWED_ORIGINS — origin фронта
  - DJANGO_ENABLE_TLS — False на HTTP-по-IP, True на домене с сертификатом
"""

from decouple import config

from .base import *  # noqa: F401,F403
from .base import SPECTACULAR_SETTINGS

DEBUG = False

# TLS-hardening под флагом: фаза 1 (по IP, HTTP) — False, фаза 2 (домен, HTTPS) — True.
# Так переход IP → домен не требует правок в Python, только в .env + nginx.
ENABLE_TLS = config("DJANGO_ENABLE_TLS", default=False, cast=bool)

# TLS терминируется на Nginx; Django доверяет X-Forwarded-Proto от nginx.
# Заголовок безопасен всегда — оставляем включённым при любом протоколе.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# При ENABLE_TLS=False (фаза 1) редиректа на https НЕТ и куки не Secure —
# иначе по HTTP была бы редирект-петля и не работал бы вход в админку.
SECURE_SSL_REDIRECT = ENABLE_TLS
SESSION_COOKIE_SECURE = ENABLE_TLS
CSRF_COOKIE_SECURE = ENABLE_TLS

SECURE_HSTS_SECONDS = 31_536_000 if ENABLE_TLS else 0  # 1 год только на HTTPS
SECURE_HSTS_INCLUDE_SUBDOMAINS = ENABLE_TLS
SECURE_HSTS_PRELOAD = ENABLE_TLS

# Безопасны при любом протоколе:
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# Swagger на проде закрыт.
SPECTACULAR_SETTINGS["SERVE_INCLUDE_SCHEMA"] = False