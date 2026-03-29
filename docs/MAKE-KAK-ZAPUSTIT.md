# Make.com + сайт: как запустить за 5 минут

## 1. Что уже должно быть

- На **хостинге** (Vercel и т.д.) заданы те же переменные, что в **`.env.local`** (секреты в Git не кладут — см. [`SECRETS.ru.md`](SECRETS.ru.md)):
  - `NEXT_PUBLIC_SITE_URL` — ваш реальный домен с `https://`
  - `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN`
  - **`MAKE_WEBHOOK_SECRET`** — один и тот же длинный секрет в `.env.local`, на хостинге и в Make.

Без Redis и секрета webhook ответит ошибкой.

## 2. URL для Make

Подставьте **ваш** домен:

```
https://ВАШ-ДОМЕН.ru/api/webhooks/make
```

Например staging: `https://xxx.vercel.app/api/webhooks/make`.

## 3. Сценарий в Make

1. Зайдите на [make.com](https://www.make.com), создайте **новый сценарий**.
2. Добавьте модуль **HTTP → Make a request** (или аналог).
3. Настройки:
   - **Method:** `POST`
   - **URL:** `https://ВАШ-ДОМЕН.ru/api/webhooks/make`
   - **Headers** — добавьте **один** из вариантов:
     - Имя: `Authorization`, значение: `Bearer ` + **ваш** `MAKE_WEBHOOK_SECRET` (с пробелом после слова Bearer)
     - **или** имя: `X-Make-Secret`, значение: **тот же** секрет без слова Bearer
   - **Body type:** Raw, **Content-Type:** `application/json`
   - **Request content:** вставьте JSON (см. пример ниже или полный список полей в `README.md`).

4. Сохраните секрет в **Variables** Make (например `MARS_SECRET`), в заголовке укажите: `Bearer {{MARS_SECRET}}`.

## 4. Минимальный тестовый JSON (новость)

Скопируйте в тело запроса и **один раз** выполните сценарий. Если всё ок, ответ будет `{"ok":true,...}` и на сайте появится материал.

```json
{
  "action": "upsert",
  "post": {
    "slug": "test-iz-make-2026",
    "kind": "news",
    "title": "Тест публикации из Make",
    "lead": "Если вы это видите на сайте — webhook работает.",
    "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&h=900&q=80",
    "authorId": "mv1",
    "rubricSlugs": ["media"],
    "tagSlugs": ["rynki"],
    "publishedAt": "2026-03-28T15:00:00.000Z"
  }
}
```

Удалить тестовую новость можно так:

```json
{
  "action": "delete",
  "slug": "test-iz-make-2026"
}
```

## 5. Если ошибка

| Код | Причина |
|-----|--------|
| 401 | Неверный или пустой секрет в заголовке |
| 503 | Не заданы переменные Upstash на сервере |
| 400 | Неверный JSON или неизвестный `authorId` / рубрика / тег — см. справочник в админке или `README.md` |

## 6. Безопасность

- Файл **`.env.local`** и секреты **не коммитьте** в Git.
- Токен Upstash, если когда-либо попадал в открытый доступ, **смените** в консоли Upstash (Rotate token).

## 7. VPS (nginx) и почему «Make ок, а на сайте пусто»

### Где реально лежат материалы

- Тексты, slug, ссылка на картинку (`image` как URL), рубрики — это **JSON в Upstash Redis**, а не файлы на диске VPS. Сайт при рендере читает Redis (и при необходимости мержит со статикой из кода — см. ниже).
- Само изображение Make обычно кладёт **внешней ссылкой** (CDN, mcp-kv и т.д.); Next.js отдаёт его через `next/image`, **скачивание на VPS для поста не требуется**.

### Обязательно проверьте `POSTS_FEED_MODE`

- Если в `.env.production` задано **`POSTS_FEED_MODE=remote_only`**, на сайте показываются **только** посты из Redis. Пустой Redis → **пустой сайт** (включая «пропажу» демо-материалов из репозитория).
- Если переменная **не задана**, лента = **статика из кода + Redis** (одинаковый `slug` в Redis перекрывает статику).

### Webhook отвечает только после сохранения

- Ответ `{"ok":true,"saved":true,...}` означает: запись в Redis уже выполнена, затем сброшен кеш Next.js.
- Если nginx снова отдаёт **504**, увеличьте в `location` прокси к Node, например: `proxy_read_timeout 180s;`
- Либо на сервере задайте **`MAKE_WEBHOOK_LIGHT_REVALIDATE=1`** — тогда после сохранения сбрасываются только теги кеша (быстрее; отдельные страницы могут обновиться с небольшой задержкой до следующего визита).

### После сбоев

- Повторите сценарий Make **upsert** для нужных материалов.
- В консоли Upstash проверьте ключи: набор `marsmedia:posts:v2:slugs` и строки `marsmedia:posts:v2:item:<slug>`.
