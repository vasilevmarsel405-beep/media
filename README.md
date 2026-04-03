# КриптоМарс Медиа

Сайт на **Next.js 16** (App Router): новости, статьи, аналитика, видео, админка, аналитика посещений, **webhook Make.com** и **Upstash Redis**.

## Быстрый старт

```bash
cd marsmedia
cp .env.example .env.local
# Заполните .env.local (см. ниже)
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Переменные окружения

Секреты не коммитьте: только **`.env.local`** и панель хостинга. Подробно — [`docs/SECRETS.ru.md`](docs/SECRETS.ru.md). Перед коммитом: `npm run secrets:check`.

| Переменная | Назначение |
|------------|------------|
| `NEXT_PUBLIC_SITE_URL` | Публичный URL без `/` в конце (canonical, OG, sitemap, JSON-LD). |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Redis: посты из админки/Make, аналитика, рассылка, форма контактов. **Без них Make webhook вернёт 503.** |
| `MAKE_WEBHOOK_SECRET` | Секрет для `POST /api/webhooks/make` (заголовок ниже). **Обязателен для автоматизации.** |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Вход в админку (JWT-секрет ≥ 16 символов). |
| `NEXT_PUBLIC_IMAGE_REMOTE_HOSTS` | Доп. домены для `next/image` (картинки из Make/CDN), через запятую, без `https://`. |
| `ENABLE_HSTS=1` | HSTS (только при постоянном HTTPS). |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Номер счётчика Яндекс.Метрики (цифры). |
| `YANDEX_METRIKA_OAUTH_TOKEN` | OAuth-токен для [Reporting API](https://yandex.ru/dev/metrika/doc/api2/api_v1/intro.html): сводка визитов в админке. Только сервер, не в Git. |
| `YANDEX_METRIKA_COUNTER_ID` | Опционально: ID счётчика для API, если не совпадает с публичным. |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Верификация Яндекс.Вебмастера. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Верификация Google Search Console. |
| `PODCAST_RSS_URL` | (Опционально) Публичный URL RSS подкаста с Mave или другого хостинга — страница `/podkasty` строит список выпусков из фида. |
| `PODCAST_RSS_REVALIDATE_SECONDS` | (Опционально) Как часто сервер перезапрашивает RSS (кеш Data Cache), по умолчанию `600`, минимум `60`. |
| `NEXT_PUBLIC_PODCAST_YANDEX_URL` | (Опционально) Ссылка на альбом в Яндекс.Музыке для кнопки на `/podkasty`; иначе используется URL по умолчанию в коде. |

Файл **`.env.local` не коммитится**. На **Vercel** / другом хостинге задайте те же переменные в панели.

### Подкасты и RSS (Mave и др.)

В кабинете хостинга подкастов скопируйте **публичный URL RSS-ленты** (у Mave это обычно отдельное поле «RSS» / feed URL) и задайте его в **`PODCAST_RSS_URL`**. Страница **`/podkasty`** на сервере запрашивает фид, парсит выпуски и кеширует ответ (по умолчанию на **600 с**; см. `PODCAST_RSS_REVALIDATE_SECONDS`). Новый эпизод появится на сайте после истечения кеша и следующей генерации страницы (у страницы свой `revalidate`, сейчас 300 с). Если переменная не задана, показывается запасной статический список из `src/lib/copy.ts`.

---

## Чеклист перед релизом

1. **Прод-окружение:** `NEXT_PUBLIC_SITE_URL`, Upstash, `MAKE_WEBHOOK_SECRET`, админские секреты (если пользуетесь админкой).
2. **Картинки из Make:** если обложки не с Unsplash/Bunny/Cloudinary/S3-паттернов из `next.config.ts` — добавьте хосты в `NEXT_PUBLIC_IMAGE_REMOTE_HOSTS` и пересоберите.
3. **Сборка:** `npm run lint` и `npm run build` без ошибок.
4. **HTTPS:** после стабильного сертификата — `ENABLE_HSTS=1`.
5. **Аналитика:** `NEXT_PUBLIC_YANDEX_METRIKA_ID` (счётчик на сайте); опционально `YANDEX_METRIKA_OAUTH_TOKEN` (сводка в админке); верификация Вебмастер / GSC при необходимости.
6. **Юридические страницы:** финальные тексты с юристом (политики, контакты).
7. **Make:** один тестовый `upsert` на staging/прод (см. ниже), проверка URL материала и `sitemap.xml`.

---

## Make.com: автоматизация публикаций

Короткая пошаговая инструкция (URL, заголовки, готовый JSON для теста): [`docs/MAKE-KAK-ZAPUSTIT.md`](docs/MAKE-KAK-ZAPUSTIT.md).

**Свой VPS (не Vercel):** те же переменные, что в `.env.local`, положите в **`.env.production`** в каталоге приложения на сервере — см. [`docs/VPS-ENV.ru.md`](docs/VPS-ENV.ru.md). Проверка: `npm run env:check`.

### Что уже сделано в коде

- Эндпоинт **`POST /api/webhooks/make`** принимает JSON, пишет материалы в Redis, сбрасывает кеш страниц (`revalidatePath` / `revalidateTag`).
- Ответ **401** — неверный или пустой секрет. **503** — не заданы переменные Upstash. **400** — невалидный JSON или неизвестные `authorId` / рубрики / теги.

### URL и авторизация

- **URL:** `https://<ваш-домен>/api/webhooks/make`  
  (локально: `http://localhost:3000/api/webhooks/make` — при работающем `npm run dev` и настроенном Redis; в dev без Upstash используется файл `.local/remote-posts.json`, см. `redis-posts.ts`.)

- **Заголовок** (любой из вариантов):
  - `Authorization: Bearer <MAKE_WEBHOOK_SECRET>`
  - или `X-Make-Secret: <MAKE_WEBHOOK_SECRET>`

В Make: модуль **HTTP → Make a request** → Method **POST** → URL как выше → Headers добавьте один из вариантов. Значение секрета храните в **Variables** сценария, не в теле сценария в открытом виде.

### Тело запроса: создать или обновить (`upsert`)

Полный список полей и ограничений — в `src/lib/post-ingest-schema.ts` (Zod). Обязательные: `slug`, `kind`, `title`, `lead`, `image`, `authorId`, `publishedAt` (ISO-строка). `paragraphs` опциональны; если не переданы, подставится заглушка.

**Пример: новость**

```json
{
  "action": "upsert",
  "post": {
    "slug": "make-demo-novost-2026",
    "kind": "news",
    "title": "Заголовок из Make",
    "lead": "Лид одним-двумя предложениями для карточек и сниппета.",
    "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&h=900&q=80",
    "authorId": "mv1",
    "rubricSlugs": ["biznes", "trendy"],
    "tagSlugs": ["ekonomika", "rynki"],
    "publishedAt": "2026-03-28T12:00:00.000Z",
    "readMin": 3,
    "seoTitle": "SEO-заголовок до ~60 символов",
    "seoDescription": "Описание для поиска и соцсетей, до ~160 символов по смыслу."
  }
}
```

**Пример: удаление**

```json
{
  "action": "delete",
  "slug": "make-demo-novost-2026"
}
```

### Справочник значений (должны совпадать с `src/lib/content.ts`)

| Поле | Допустимые значения |
|------|---------------------|
| `kind` | `news`, `article`, `analytics`, `interview`, `video` |
| `authorId` | `mv1` (Васильев Марсель, CEO КриптоМарс Медиа) |
| `rubricSlugs` | `politika`, `biznes`, `tekhnologii`, `kultura`, `obshchestvo`, `media`, `mneniya`, `trendy` |
| `tagSlugs` | `ekonomika`, `ai`, `klimat`, `goroda`, `zdravookhranenie`, `rynki`, `bezopasnost`, `obrazovanie`, `startapy`, `regulirovanie`, `potrebiteli`, `data` |

Тот же список выводится в админке (**Обзор** → блок «Справочник для Make»).

`slug`: только латиница, цифры и дефисы, например `moy-material-2026`.

### Что делать дальше в Make

1. Создайте **Variable** (например `MARS_WEBHOOK_SECRET`) = значение `MAKE_WEBHOOK_SECRET` с сервера.
2. Соберите сценарий: источник (Google Sheets, Telegram, форма, ИИ) → **JSON** или **Set multiple variables** → **HTTP** на URL webhook с заголовком `Authorization: Bearer {{MARS_WEBHOOK_SECRET}}` и телом JSON.
3. Обработайте ответ: при `ok: true` в теле будет `urlPath` — относительный путь опубликованного материала; полный URL = `NEXT_PUBLIC_SITE_URL` + `urlPath`.
4. Добавьте фильтр ошибок: при статусе 400 вывести `error` из JSON (в dev доступен `details` валидации).
5. После выкладки проверьте в браузере страницу материала и при необходимости переотправьте sitemap в Вебмастер.

---

## Админка

Вход по скрытой ссылке в подвале сайта (или прямой путь из `src/lib/admin-entry-path.ts`). После входа — обзор, материалы в облаке, статистика, справочник полей для Make.

## Деплой

- Сборка: `npm run build`
- Запуск: `npm run start`

Проект деплоится как отдельное приложение в папке `marsmedia` (без локального `file:`-зависимости на родительский каталог).

Если в корне репозитория (`Media/`) остаётся свой `package-lock.json`, при `next build` может появляться предупреждение Turbopack о двух lockfile — на сборку это не влияет; при желании уберите корневой lock или задайте корень только на `marsmedia` в настройках CI.

---

## SEO и вебмастеры

**Уже в проекте**

- `lang="ru"`, метаданные, `keywords`, `robots`, canonical на материалах, Open Graph и Twitter-карточки.
- Поле **`authors`** в метаданных публикаций (связь с страницей автора).
- **`/sitemap.xml`**, **`/robots.txt`**, **`/rss.xml`** (RSS в подвале).
- JSON-LD: **Organization** + **WebSite** + **SearchAction**, **Article**/**NewsArticle**, **VideoObject**, **BreadcrumbList**, **FAQPage** на «О проекте».
- Динамические **`/icon`**, **`/apple-icon`**, **PWA manifest**.
- Яндекс.Метрика: счётчик при `NEXT_PUBLIC_YANDEX_METRIKA_ID` (не на `/admin`); Reporting API в админке при `YANDEX_METRIKA_OAUTH_TOKEN`.

**После релиза вручную**

- Добавить сайт в [Яндекс.Вебмастер](https://webmaster.yandex.ru/) и Google Search Console, указать sitemap: `https://<домен>/sitemap.xml`.
- Задать коды верификации через env (см. таблицу выше).
- Следить за покрытием в индексе, скоростью (Core Web Vitals) и поведением в выдаче — это уже не заменяет кодом.

**Краткий SEO-разбор**

- **Сильные стороны:** техническая база (структура, микроразметка, RSS/sitemap, русская локаль, поиск по сайту в схеме), осмысленные title/description на уровне шаблонов и полей `seoTitle`/`seoDescription` у постов.
- **Риски:** дубли или тонкий контент на демо-материалах; внешние URL картинок без разрешённого хоста сломают рендер до правки `next.config` / env.
- **Рост:** регулярный уникальный контент через Make, внутренние ссылки между материалами, обновление `lastModified` в sitemap для важных страниц (сейчас для статики используется время сборки — при необходимости можно доработать).

---

## Документы на сайте

Политика конфиденциальности, пользовательское соглашение, редакционная политика, cookie, контакты — приведите тексты к финальному виду с вашим юристом.

## Линт

```bash
npm run lint
```
