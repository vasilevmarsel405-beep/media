# Переменные окружения на VPS (REG.RU и аналоги)

Код уже использует **Upstash Redis** и **Make webhook** — дописывать логику в репозитории не нужно. Нужно только, чтобы **на сервере** были те же ключи, что локально.

## Как Next.js подхватывает env

При **`npm run build`** и **`npm run start`** в каталоге проекта Next читает `.env.production` и при необходимости `.env.production.local`.

Файл **`.env.local`** на сервере **не обязателен** — удобнее положить всё в **`.env.production`**.

## Что скопировать на сервер

Скопируйте содержимое своего **`.env.local`** (с ПК) в файл на VPS:

```bash
nano /var/www/cryptomars/.env.production
```

Путь подставьте свой (где лежит `package.json` с именем `marsmedia`).

**Обязательные переменные** (имена те же, что в `.env.example`):

| Переменная | Зачем |
|------------|--------|
| `NEXT_PUBLIC_SITE_URL` | URL сайта с `https://` |
| `UPSTASH_REDIS_REST_URL` | Redis — посты, формы, аналитика, webhook Make |
| `UPSTASH_REDIS_REST_TOKEN` | То же |
| `REDIS_READ_TIMEOUT_MS` (необяз.) | Лимит ожидания чтения **ленты постов** из Upstash (по умолчанию 12000 мс). Если не задать, при плохой связи с Upstash страница могла «висеть» из‑за многократных ретраев SDK. |
| `UPSTASH_REDIS_RETRIES` (необяз.) | Число повторов HTTP к Upstash, 0–5 (по умолчанию 2). |
| `MAKE_WEBHOOK_SECRET` | Секрет для `POST /api/webhooks/make` |
| `ADMIN_PASSWORD` | Вход в админку |
| `ADMIN_SESSION_SECRET` | JWT сессии (не короче 16 символов) |

Опционально: `NEXT_PUBLIC_YANDEX_METRIKA_ID`, `YANDEX_METRIKA_OAUTH_TOKEN`, `NEXT_PUBLIC_IMAGE_REMOTE_HOSTS`, после стабильного HTTPS — `ENABLE_HSTS=1`.

**Только облачные материалы на сайте (без демо из кода):** в `.env.production` добавьте `POSTS_FEED_MODE=remote_only`, затем перезапуск с `--update-env`. По умолчанию лента — статика из репозитория плюс Redis, облако перезаписывает совпадающие slug.

**Автозаполнение видео из YouTube в админке** — на VPS обязательно продублируйте ключ (его нет в Git, только у вас локально в `.env.local`):

| Переменная | Зачем |
|------------|--------|
| `YOUTUBE_DATA_API_KEY` | [YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) — заголовок и полное описание ролика. Без ключа иногда срабатывает только oEmbed (урезанно), а при блокировке YouTube с VPS не сработает ничего. |

Пример — одна строка в том же `.env.production`:

```env
YOUTUBE_DATA_API_KEY=ваш_ключ
```

Сохраните файл, затем:

```bash
cd /var/www/cryptomars
npm run env:check
pm2 restart marsmedia --update-env
```

`--update-env` нужен, чтобы PM2 подхватил новые переменные после правки `.env.production`.

## Make.com

URL webhook: **`https://ВАШ-ДОМЕН/api/webhooks/make`**  
Заголовок: **`Authorization: Bearer <тот же MAKE_WEBHOOK_SECRET, что в .env.production>`**

Подробнее: [`MAKE-KAK-ZAPUSTIT.md`](MAKE-KAK-ZAPUSTIT.md).

## 504 Gateway Time-out от Nginx

Если страница «висит» и потом 504, чаще всего прокси обрывает ожидание ответа от Node **раньше**, чем успевают завершиться запросы к Upstash. В блоке `location /` задайте таймауты не короче 60–75 секунд, например как в [`nginx-cryptomarsmedia.conf.example`](nginx-cryptomarsmedia.conf.example) (`proxy_read_timeout`, `proxy_connect_timeout`). После правки: `sudo nginx -t && sudo systemctl reload nginx`.

## Если секреты засветились в чате или скрине

1. **Upstash** — rotate token в консоли, обновить `UPSTASH_REDIS_REST_TOKEN` везде.
2. Новый **MAKE_WEBHOOK_SECRET** — на сервере и в Make.
3. Сменить **пароль админки** и при желании `ADMIN_SESSION_SECRET`.
4. При необходимости перевыпустить **Yandex OAuth** для Метрики.

## Безопасность

- **Не коммить** `.env.local` / `.env.production` в Git.

## Обложки видео с админки

Файлы попадают в каталог **`.local/uploads/covers/`** на сервере (не в Git) и отдаются через URL вида **`/api/media/covers/<file>`**. Такой способ не ломается при разных схемах запуска Next.js (`next start` / standalone).

### Ошибка «HTTP 413» при загрузке обложки

Это не Next.js и не код приложения — **прокси перед Node** (почти всегда Nginx) отклоняет тело запроса. Загрузка не доходит до `/api/admin/upload-cover`.

#### Шаг 1 — убедиться, что лимит есть в том `server`, который обслуживает ваш домен

В `default` может быть `client_max_body_size`, но запрос может идти в **другой файл** (отдельный vhost для `cryptomarsmedia.ru` и HTTPS). Смотрите полную собранную конфигурацию:

```bash
sudo nginx -T 2>/dev/null | grep -nE "server_name|client_max_body_size|listen"
```

Найдите блок `server { ... }`, где в `server_name` указан **именно ваш домен** (не только `default_server` и не `server_name _;`). Частая ошибка: поставить `client_max_body_size` только в «дефолтном» блоке — тогда основной сайт по домену всё ещё ограничен **1 МБ**. В **этот** блок добавьте (или поднимите лимит):

```nginx
client_max_body_size 20M;
```

Проверка и применение:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

#### Шаг 2 — если 413 остаётся: лимит на весь Nginx (в `http`)

Иногда удобнее задать один раз в `/etc/nginx/nginx.conf` внутри `http { ... }` **до** включения сайтов:

```nginx
http {
    client_max_body_size 20M;
    ...
}
```

Затем снова `sudo nginx -t && sudo systemctl reload nginx`.

#### Шаг 3 — проверить, что нет ещё одного `client_max_body_size` меньше вашего внутри `location`

Команда:

```bash
sudo grep -R "client_max_body_size" /etc/nginx/
```

Если для `location /api/` или `location /` указано, например, `1m`, оно будет действовать для этого пути — увеличьте или уберите дубликат.

#### Шаг 4 — не Nginx

Если перед сервером стоят **другой прокси**, **балансировщик** или панель хостинга — там может быть свой лимит тела запроса; тогда 413 отдаёт они, а не ваш `default`.

Проверка с сервера (подставьте домен и путь к маленькому файлу):

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -X POST -F "file=@/path/to/small.jpg" \
  -H "Cookie: ИМЯ_КУКИ=ЗНАЧЕНИЕ" https://ВАШ-ДОМЕН/api/admin/upload-cover
```

(куки админки можно скопировать из браузера после входа.)

---

Лимит в приложении — до **6 МБ** на файл. После правки Nginx обложка 3 МБ должна проходить.

Готовый шаблон vhost с `client_max_body_size` в блоках именно вашего домена: [`nginx-cryptomarsmedia.conf.example`](nginx-cryptomarsmedia.conf.example) — скопируйте на сервер и подставьте пути SSL и порт `proxy_pass`.
