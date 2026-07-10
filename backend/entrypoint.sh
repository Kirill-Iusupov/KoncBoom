#!/bin/sh
# entrypoint.sh — выполняется при старте контейнера backend.
# Запускается от непривилегированного пользователя django.
set -e

echo "==> Применяем миграции..."
python manage.py migrate --noinput

echo "==> Собираем статику..."
python manage.py collectstatic --noinput --clear

echo "==> Запускаем Gunicorn (3 воркера)..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --worker-class sync \
    --timeout 60 \
    --access-logfile - \
    --error-logfile -
