# Turso — база данных Caloria Tracker

Приложение хранит пользователей, еду и активность в **Turso** (SQLite в облаке). Это нужно для деплоя на **Vercel**.

## 1. Установка Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

Перезапустите терминал, затем:

```bash
turso auth login
```

## 2. Создание базы

```bash
turso db create caloria-tracker
turso db show caloria-tracker --url
turso db tokens create caloria-tracker
```

Скопируйте **Database URL** и **token**.

## 3. Переменные окружения

В `.env.local`:

```env
TURSO_DATABASE_URL=libsql://caloria-tracker-ВАШ-ОРГ.turso.io
TURSO_AUTH_TOKEN=eyJ...
```

Те же переменные добавьте в **Vercel → Project → Settings → Environment Variables**.

## 4. Создание таблиц

Из корня проекта:

```bash
npm run db:init
```

Должно появиться: `✅ Схема Turso применена`.

## 5. Перенос старых данных (необязательно)

Если раньше использовали `data/db.json`:

```bash
npm run db:migrate
```

## 6. Локальный запуск

```bash
npm run dev
```

## 7. Vercel

1. Push на GitHub.
2. Import проекта в Vercel.
3. Env: `AUTH_SECRET`, `TURSO_*`, Google OAuth (с URL вашего `.vercel.app`).
4. Deploy.
5. Один раз выполните `npm run db:init` **локально** с production URL Turso (или через Turso shell).

## Файлы схемы

| Файл | Назначение |
|------|------------|
| `lib/schema.sql` | SQL-таблицы `users`, `meals`, `burns` |
| `lib/turso.js` | Подключение клиента |
| `lib/db.js` | Запросы к БД |
| `scripts/init-turso.mjs` | Применить схему |
| `scripts/migrate-json-to-turso.mjs` | Импорт из JSON |
