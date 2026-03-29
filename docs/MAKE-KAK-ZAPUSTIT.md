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
