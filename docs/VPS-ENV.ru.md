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
| `MAKE_WEBHOOK_SECRET` | Секрет для `POST /api/webhooks/make` |
| `ADMIN_PASSWORD` | Вход в админку |
| `ADMIN_SESSION_SECRET` | JWT сессии (не короче 16 символов) |

Опционально: `NEXT_PUBLIC_YANDEX_METRIKA_ID`, `YANDEX_METRIKA_OAUTH_TOKEN`, `NEXT_PUBLIC_IMAGE_REMOTE_HOSTS`, после стабильного HTTPS — `ENABLE_HSTS=1`.

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

## Если секреты засветились в чате или скрине

1. **Upstash** — rotate token в консоли, обновить `UPSTASH_REDIS_REST_TOKEN` везде.
2. Новый **MAKE_WEBHOOK_SECRET** — на сервере и в Make.
3. Сменить **пароль админки** и при желании `ADMIN_SESSION_SECRET`.
4. При необходимости перевыпустить **Yandex OAuth** для Метрики.

## Безопасность

- **Не коммить** `.env.local` / `.env.production` в Git.
