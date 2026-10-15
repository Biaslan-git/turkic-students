# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Что это

Лендинг + waitlist для TÜRKSOY STUDENTS (`turkicstudents.org`), Next.js 16 (App Router, React 19). Двухшаговая форма регистрации, Postgres, письмо через Resend, приватная админка для просмотра/экспорта заявок.

## Команды

```
npm run dev      # dev-сервер
npm run build    # прод-сборка (output: standalone)
npm run start    # запуск собранного standalone-сервера
npm run lint      # eslint (flat config, next/core-web-vitals + next/typescript)
node scripts/migrate.mjs   # применить scripts/migrate.sql к DATABASE_URL
```

Нет настроенного test runner — тестов в проекте нет.

## Переменные окружения

`DATABASE_URL`, `SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` — см. `.env.local`. Опционально: `TRANSLATE_CONTACT_EMAIL` (поднимает суточный лимит автоперевода стены идей с 5 000 до 50 000 символов), `NEXT_PUBLIC_YM_COUNTER_ID` (Яндекс.Метрика). Регистрация не отправляет email — намеренно, чтобы не зависеть от лимитов почтового провайдера при всплеске регистраций.

## Архитектура

**`proxy.ts` вместо `middleware.ts`** — это breaking change в используемой версии Next.js (см. `AGENTS.md`, файл автогенерируется `next dev`). Проверяет admin-сессию по cookie для всех `/admin/:path*` кроме `/admin/login`, на каждый успешный запрос делает sliding-expiration re-sign куки.

**Публичная часть** (`app/[locale]/page.tsx`, `components/sections/*`) — одностраничный лендинг на next-intl (ru/az/kk/ky/tk/tr/uz), секции собираются в `page.tsx`. Тексты секций лежат в БД (`site_content`, правятся в `/admin/content`, ключи — `lib/content/fields.ts`), UI-строки — в `messages/*.json`. Сид в `scripts/migrate.sql` не перезаписывает существующие строки, поэтому правки текста для уже заполненной БД делаются разовым патчем через `content_patches` (см. конец блока site_content). Одна регистрация на всё (нет отдельной формы для инициативы «Твой голос — твой фестиваль» — client явно попросил один CTA для всех), форма (`components/waitlist-form.tsx`) двухшаговая через `useActionState`:
1. `submitWaitlistBasic` (`app/actions.ts`) — имя/email + honeypot-поле `company` + rate-limit по IP (`lib/rate-limit.ts`, in-memory, 5 req/60s — не переживает рестарт/несколько инстансов), `INSERT ... ON CONFLICT (lower(email)) DO NOTHING` в `lib/waitlist.ts`.
2. `submitWaitlistDetails` — роль (студент/выпускник), университет (справочник `festival_universities`, редактируется в `/admin/universities`), год выпуска (опционально), опциональное мнение о фестивале (`opinion_category`/`opinion_text`, 5 фиксированных категорий + «Другое», см. `lib/constants.ts`). Email не отправляется — см. переменные окружения.

Секция фестиваля (`components/festival/festival-section.tsx`) показывает список вузов-участников без рейтинга и счётчиков — соревновательный элемент убран по просьбе клиента. Галерея (`components/sections/gallery-section.tsx`, `components/gallery/*`, `lib/gallery.ts`) читает фото из `public/gallery/<папка-вуза>/*` и собирает общую ленту по кругу (по кадру с каждого вуза, без деления по странам); пока папки пусты, секция не рендерится. `npm run gallery:optimize` (`scripts/optimize-gallery.mjs`, sharp) ужимает оригиналы до 1600px и кладёт миниатюры 480px WebP в `<вуз>/thumbs/` — на странице грузятся только они (лениво), крупная версия открывается в лайтбоксе. Показ — бегущая лента в 3 ряда (`components/gallery/gallery-view.tsx`), по клику открывается Fancybox (`@fancyapps/ui`, подгружается динамически при первом клике, листание и полоса миниатюр); в `public/gallery/placeholder-*` лежат временные заглушки — заменить настоящими фото. Первые 3 фото показываются и в хиро рядом с плашкой о фестивале.

**Стена идей** (`/ideas` + блок на главной, `components/ideas/*`, `app/idea-actions.ts`, `lib/ideas.ts`) — идеи и ответы без регистрации (категория из `OPINION_CATEGORIES`, страна из `IDEA_COUNTRIES`, вуз опционально, имя опционально), публикуются сразу, honeypot + rate-limit как в остальных формах. Перевод ленивый и бесплатный: `lib/translate.ts` ходит в MyMemory (без ключа и карты), `ensureTranslations` в `lib/ideas.ts` переводит только на тот язык, на котором запись открыли, и кэширует в `translations` (JSONB) через `after()`; при исчерпанном лимите или сбое показывается оригинал. В `/admin/ideas` — скрытие/удаление идей и ответов.

**Админка** (`app/admin/`) — route group `(dashboard)` с общим layout, защищена `proxy.ts` + повторной проверкой сессии в server actions (`app/admin/actions.ts`) и route handlers. Сессия — подписанная HMAC-SHA256 cookie (`lib/admin/session.ts`), пароль сверяется через `timingSafeEqual` (`lib/admin/auth.ts`). Экспорт CSV — `app/admin/api/export/route.ts` → `lib/admin/csv.ts`. Дополнительно: `/admin/opinions` (read-only список присланных мнений о фестивале) и `/admin/universities` (CRUD справочника вузов — добавление и скрытие, без удаления, чтобы не ломать FK у уже сохранённых регистраций), оба на `lib/admin/festival.ts`.

**База данных** — один `pg.Pool` на процесс (`lib/db.ts`, закэширован в `global` вне production, чтобы HMR не плодил пулы). Единственная таблица — `waitlist_signups` (`scripts/migrate.sql`), миграции применяются вручную скриптом, автоматического migration runner нет. Docker-образ на старте контейнера сам гоняет `node scripts/migrate.mjs` перед `node server.js` (см. `Dockerfile` CMD).

**Деплой** — многостадийный `Dockerfile`, база — `node:24-alpine` из `public.ecr.aws/docker/library/...` (не Docker Hub — см. git history). `SITE_URL` пробрасывается как build ARG, попадает в статически сгенерированный `og:image`/`og:url` (`app/opengraph-image.tsx`, `lib/constants.ts`). `next.config.ts` — `output: "standalone"`, `images.unoptimized: true` (сервер на Dokploy не может дотянуться до внешних CDN для оптимизации на лету, см. комментарий в файле).

## Стиль

Комментарии в коде — только когда нужно объяснить неочевидное решение (см. существующие примеры в `lib/rate-limit.ts`, `next.config.ts`, `lib/admin/session.ts`), не описывать что делает код.
