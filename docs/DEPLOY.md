# Деплой на домашний сервер (OMV + Cloudflare Tunnel)

Сайт `https://kantsbum.shop` крутится на сервере `anton` (доступ — только Tailscale: `ssh miro@anton`).
Белого IP нет, весь трафик идёт через общий Cloudflare Tunnel `anton` — так же, как у Unilift и whatsapp-bot:

```
Браузер ─► Cloudflare (TLS) ─► туннель "anton" ─► edge_tunnel (cloudflared)
                                                   │  docker-сеть "edge"
                                                   └─► kantsbum-web:80 (nginx)
                                                         ├─ /static/, /media/  → volumes
                                                         ├─ /api/, /admin      → backend:8000 (gunicorn)
                                                         └─ /                  → frontend:3000 (Next.js)
```

- Код — клон репо в `/appdata/KantsBum/app` (deploy key, только чтение), образы собираются на сервере.
- `backend` — Django + gunicorn, при старте `migrate` + `collectstatic` (`backend/entrypoint.sh`).
- `nginx` — конфиг `backend/nginx/tunnel.conf` (монтируется из клона), `www` → редирект на корень.
- Портов на хосте нет. БД — Postgres в volume `kantsbum_postgres_data`, фото — `kantsbum_media_data`.
- Compose-проект `KantsBum` управляется из OMV UI, файл — `docker-compose.prod.yml`,
  переменные — по образцу `.env.prod.example`.

> Старый проект `/appdata/KantsBoom` (ngrok, `runserver`, quick tunnel `koncboom_tunnel`) удаляется
> после переноса данных — раздел 5.

## 1. Домен (GoDaddy → Cloudflare)
1. Cloudflare (тот же аккаунт, где туннель `anton`) → **Add a domain** → `kantsbum.shop`, план Free.
2. В Cloudflare удалить импортированные записи `A @` (парковка GoDaddy, обычно `15.197.148.33`,
   `3.33.130.190`), `CNAME www`, `CNAME _domainconnect` — иначе маршрут туннеля не сохранится.
   Если у домена есть почта (MX/TXT) — их оставить.
3. GoDaddy → домен → **Nameservers → Change → I'll use my own** → два NS от Cloudflare.
4. Дождаться статуса **Active** (от минут до суток).

## 2. Deploy key и клон
Ключ создаётся на сервере. Репо принадлежит `Kirill-Iusupov` — добавить ключ может только админ репо.
```bash
ssh-keygen -t ed25519 -N "" -f ~/.ssh/deploy_kantsbum -C "anton-kantsbum"
cat ~/.ssh/deploy_kantsbum.pub   # → GitHub: Kirill-Iusupov/KoncBoom → Settings → Deploy keys → Add (без write)

cat >> ~/.ssh/config << 'EOF'

Host gh-kantsbum
  HostName github.com
  User git
  IdentityFile ~/.ssh/deploy_kantsbum
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
ssh -T gh-kantsbum   # "Hi Kirill-Iusupov/KoncBoom! ..."

sudo mkdir -p /appdata/KantsBum/app
sudo chown miro:users /appdata/KantsBum/app   # основная группа пользователей OMV — users
git clone gh-kantsbum:Kirill-Iusupov/KoncBoom.git /appdata/KantsBum/app
```

## 3. Данные старого проекта
Сначала посмотреть, где у старого KantsBoom лежат БД и фото:
```bash
cat /appdata/KantsBoom/compose.yml
docker ps -a --format '{{.Names}}\t{{.Image}}\t{{.Status}}' | grep -iE 'kants|konc'
docker volume ls | grep -iE 'kants|konc'
```

### 3.1 Дамп БД (старый проект на Postgres)
```bash
mkdir -p /appdata/backups
# <old-db> — контейнер postgres старого проекта, <user>/<db> — из его compose/Environment
docker exec <old-db> pg_dump -U <user> -d <db> -Fc > /appdata/backups/kantsboom-old.dump
ls -lh /appdata/backups/kantsboom-old.dump
```
Если старый проект на SQLite — выгрузить данные через Django (контейнер старого backend должен быть запущен):
```bash
docker exec <old-backend> python manage.py dumpdata --natural-foreign --natural-primary \
  --exclude contenttypes --exclude auth.permission --exclude admin.logentry --exclude sessions \
  -o /tmp/data.json
docker cp <old-backend>:/tmp/data.json /appdata/backups/kantsboom-old.json
```

### 3.2 Фото
Найти путь к `media` старого проекта (volume или папка в `/appdata/KantsBoom/...`) и сохранить архивом:
```bash
sudo tar czf /appdata/backups/kantsboom-old-media.tar.gz -C <путь-к-media> .
```

## 4. OMV
Сгенерировать секреты:
```bash
openssl rand -base64 48   # DJANGO_SECRET_KEY
openssl rand -hex 24      # POSTGRES_PASSWORD
```

OMV → Services → Compose → **Files → Create**:
- Name: `KantsBum`
- File: содержимое `docker-compose.prod.yml`
- Environment: по образцу `.env.prod.example` (OMV сохраняет его в `KantsBum.env` и делает симлинк `.env`)

**Save, но пока не Up** — сначала залить данные в пустую БД.

### 4.1 Восстановление БД
```bash
cd /appdata/KantsBum
sudo docker compose up -d db            # только Postgres, backend ещё не мигрировал
sudo docker compose exec -T db pg_restore -U koncboom -d koncboom --no-owner --role=koncboom \
  < /appdata/backups/kantsboom-old.dump
```
(`koncboom` — значения `POSTGRES_USER`/`POSTGRES_DB` из Environment.) Ошибки вида
`schema "public" already exists` безобидны. Новые миграции из репо применятся сами при старте backend.

Для SQLite-варианта — после первого Up (раздел 4.2):
```bash
docker cp /appdata/backups/kantsboom-old.json kantsbum-backend-1:/tmp/data.json
docker exec kantsbum-backend-1 python manage.py loaddata /tmp/data.json
```

### 4.2 Запуск
OMV → Compose → Files → `KantsBum` → **Up** (первый раз собирает оба образа — Next.js на Pentium
долго). Если OMV оборвёт по таймауту:
```bash
cd /appdata/KantsBum && sudo docker compose up -d --build
```
Если администраторов в перенесённой БД нет:
```bash
docker exec -it kantsbum-backend-1 python manage.py createsuperuser
```

### 4.3 Фото в volume (после первого Up)
```bash
docker run --rm -v kantsbum_media_data:/dst -v /appdata/backups:/src:ro alpine \
  sh -c 'tar xzf /src/kantsboom-old-media.tar.gz -C /dst && chown -R 1000:1000 /dst'
```
`1000:1000` — пользователь `django` в образе backend, иначе загрузка фото из админки упадёт.

### 4.4 Маршруты в туннеле `anton`
Cloudflare → Networking → Tunnels → `anton` → Routes → **Published application**:

| Subdomain | Domain | Service URL |
|---|---|---|
| (пусто) | `kantsbum.shop` | `http://kantsbum-web:80` |
| `www` | `kantsbum.shop` | `http://kantsbum-web:80` |

Только `http://` — TLS делает Cloudflare. Маршрутов два: один маршрут = одно имя. DNS-записи
(CNAME на `<id>.cfargotunnel.com`) Cloudflare создаёт сам.

## 5. Удаление старого KantsBoom
Только после проверки (раздел 8) и при наличии файлов в `/appdata/backups`:
1. OMV → Compose → Files → `KantsBoom` → **Down**, затем **Delete**.
2. Остановить и удалить его туннели: `docker rm -f koncboom_tunnel` (и ngrok-контейнер, если отдельный).
3. Volumes старого проекта (`docker volume ls | grep -i kantsboom`) — удалить через неделю-другую,
   когда новый стенд точно в порядке: `docker volume rm <name>`.
4. Если в старом compose был GitHub PAT в URL репо — отозвать его на GitHub.

## 6. Обновление
```bash
cd /appdata/KantsBum/app && git pull
```
Затем OMV → Compose → Files → `KantsBum` → **Up** (образы пересоберутся, миграции применятся при старте).

Если `docker-compose.prod.yml` в репо поменялся — обновить его и в OMV (Edit → вставить → Save).
`tunnel.conf` монтируется из клона: после его изменения достаточно `git pull` и
`docker restart kantsbum-nginx-1`.

## 7. Бэкап
```bash
cd /appdata/KantsBum
sudo docker compose exec -T db pg_dump -U koncboom -d koncboom -Fc > /appdata/backups/kantsbum-$(date +%F).dump
docker run --rm -v kantsbum_media_data:/media:ro -v /appdata/backups:/out alpine \
  tar czf /out/kantsbum-media-$(date +%F).tar.gz -C /media .
```
Копию нужно уносить с сервера (rclone → облако) — TODO, как и у остальных проектов.

## 8. Проверка
```bash
# изнутри сети edge, как видит туннель
docker run --rm --network edge curlimages/curl:8.10.1 -sI \
  -H "Host: kantsbum.shop" -H "X-Forwarded-Proto: https" http://kantsbum-web/api/catalog/

curl -sI https://kantsbum.shop/healthz                 # 200
curl -sI https://kantsbum.shop/                        # 200
curl -sI https://www.kantsbum.shop/ | grep -i location # → https://kantsbum.shop/
curl -sI https://kantsbum.shop/admin/ | grep -i location # → /admin/login/, без цикла редиректов
```
В браузере: каталог с товарами и картинками, вход в `/admin/`, тестовый заказ.
