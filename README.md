# Caloria Tracker

Веб-приложение на **Next.js (JavaScript)** для учёта съеденных и сожжённых калорий: регистрация, дневник питания, история по дням и круговая диаграмма долей калорий.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## База данных (Turso)

Данные хранятся в **Turso**. Пошаговая настройка: **[docs/TURSO.md](docs/TURSO.md)**.

```bash
npm run db:init      # создать таблицы
npm run db:migrate   # перенести data/db.json (если был)
```

## Возможности

- Регистрация и вход (Turso SQLite)
- Добавление еды: своё название или подсказки из списка, категория и приём пищи
- Учёт сожжённых калорий (активность)
- Сводка за сегодня: съедено, сожжено, баланс
- Pie chart — процент и ккал по каждому блюду за день
- Страница **История** с просмотром прошлых дней

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

- `AUTH_SECRET` — секрет для сессий
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_ID` — один и тот же Client ID из [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (тип **Web application**, в **Authorized JavaScript origins** добавьте `http://localhost:3000`)

После изменения `.env.local` перезапустите `npm run dev`.

## Вход через Google

На страницах входа и регистрации — кнопка Google. Новый пользователь создаётся автоматически; если email уже есть (регистрация по паролю), аккаунты связываются.
