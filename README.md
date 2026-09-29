# Мини-блог о pet-проектах

Статический блог на Astro: проекты хранятся в Markdown, публикуются на GitHub Pages и при необходимости анонсируются в Telegram и VK.

## Локальный запуск

Требуется Node.js 22 или новее.

```bash
npm install
npm run dev
```

Проверка production-сборки:

```bash
npm run build
npm run preview
```

## Новая запись

Скопируйте любой файл из `src/content/projects/` и измените frontmatter:

```yaml
---
title: "Название проекта"
description: "Одно предложение для карточки и анонса."
publishedAt: 2026-09-29
status: building # idea | building | released
stack: [Astro, TypeScript]
repository: https://github.com/username/repository
demo: https://example.com
featured: true
draft: false
announce: true
---
```

`draft: true` скрывает запись на сайте. `announce: false` публикует её на сайте без анонса в соцсетях.

## GitHub Pages

1. Создайте пустой репозиторий на GitHub и загрузите в него содержимое этой папки.
2. В **Settings → Pages → Source** выберите **GitHub Actions**.
3. Добавьте repository variables:
   - `SITE_URL`: `https://USERNAME.github.io`
   - `BASE_PATH`: `/REPOSITORY` (оставьте `/` для репозитория `USERNAME.github.io` или собственного домена).
4. Push в `main` запустит `.github/workflows/deploy.yml`.

Во время GitHub Actions `astro.config.mjs` сам получает имя владельца и репозитория. Локально значения можно переопределить через переменные окружения.

## Автопубликация в Telegram и VK

Workflow `.github/workflows/crosspost.yml` обрабатывает только новые и изменённые Markdown-файлы в `main`. Для повторного анонса его можно запустить вручную, указав путь к записи.

Добавьте в **Settings → Secrets and variables → Actions → Secrets**:

| Secret | Назначение |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | токен бота от BotFather |
| `TELEGRAM_CHAT_ID` | `@channel_name` или числовой ID; бот должен уметь публиковать |
| `VK_ACCESS_TOKEN` | токен сообщества/пользователя с правом публикации на стене |
| `VK_GROUP_ID` | положительный числовой ID группы |

Если секреты одной из платформ не заданы, она пропускается. Токены никогда не добавляйте в `.env.example`, Markdown или историю Git.

## Что настроить под себя

- заменить тексты и ссылки в `src/pages/`;
- удалить демонстрационные записи или использовать их как шаблон;
- при необходимости добавить `repository` и `demo` в записи;
- подключить репозиторий и заполнить GitHub Actions variables/secrets.
