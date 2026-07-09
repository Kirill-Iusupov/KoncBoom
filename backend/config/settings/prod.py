"""
Продакшн-настройки.
Запускать с DJANGO_SETTINGS_MODULE=config.settings.prod.

Чеклист перед деплоем:
  - DEBUG=False (задаётся здесь, не через .env)
  - DJANGO_SECRET_KEY — длинная случайная строка (не дефолтная)
  - DJANGO_ALLOWED_HOSTS — реальный домен
  - CORS_ALLOWED_ORIGINS — только домен фронта
  - POSTGRES_PASSWORD — надёжный пароль
  - collectstatic выполнен перед стартом контейнера
"""

from decouple import Csv, config

from .base import *  # noqa: F401,F403
from .base import SPECTACULAR_SETTINGS

DEBUG = False

ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", cast=Csv())

# --- Безопасность транспорта (TLS на Nginx, Django доверяет X-Forwarded-Proto) ---
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 31_536_000  # 1 год
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# TLS терминируется на Nginx, Django получает http внутри docker-сети.
# Заголовок X-Forwarded-Proto=https выставляет Nginx → Django понимает что HTTPS.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Swagger на проде закрыт — документация не должна быть публичной.
# Раскомментируйте если хотите открыть для внутренней команды:
# SPECTACULAR_SETTINGS["SERVE_INCLUDE_SCHEMA"] = True
SPECTACULAR_SETTINGS["SERVE_INCLUDE_SCHEMA"] = False
