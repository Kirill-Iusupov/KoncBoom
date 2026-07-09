# syntax=docker/dockerfile:1

# --- Stage 1: builder — зависимости в изолированный venv ---
FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# --- Stage 2: runtime — только то, что нужно для запуска ---
FROM python:3.12-slim AS runtime

# Непривилегированный пользователь — контейнер не работает от root
RUN groupadd --gid 1000 django \
    && useradd --uid 1000 --gid django --shell /bin/bash --create-home django

# libpq5 — runtime-библиотека PostgreSQL (psycopg3)
# libjpeg62-turbo, zlib1g — runtime-библиотеки Pillow (ImageField)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       libpq5 \
       libjpeg62-turbo \
       zlib1g \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY --chown=django:django . .

# Создаём директории для статики и медиа с правильным владельцем
RUN mkdir -p staticfiles media \
    && chown -R django:django staticfiles media

USER django

EXPOSE 8000

# entrypoint.sh: migrate + collectstatic + gunicorn
# Скрипт запускается от непривилегированного пользователя django
COPY --chown=django:django entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
