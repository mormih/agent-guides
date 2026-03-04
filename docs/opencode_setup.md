# Настройка OpenCode

## Конфигурация

Основной конфигурационный файл OpenCode находится по пути:
```
~/.config/opencode/opencode.json
```

## Аутентификация

### Файлы auth

OpenCode хранит данные аутентификации в двух locations:

| Путь | Описание |
|------|----------|
| `~/.config/opencode/` | Плагины (например, antigravity-accounts.json) |
| `~/.local/share/opencode/auth.json` | Основные токены (OpenAI, Google и др.) |

## Установка плагинов

### Шаг 1: Добавление плагина в конфигурацию

Отредактируйте файл `~/.config/opencode/opencode.json` и добавьте плагин в массив `plugin`:

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

Для beta-версии:
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

### Шаг 2: Настройка моделей

Добавьте определения моделей в секцию `provider.google.models`:

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-opus-4-6-thinking": {
          "name": "Claude Opus 4.6 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        }
      }
    }
  }
}
```

### Шаг 3: Аутентификация

Выполните команду для входа:
```bash
opencode auth login
```

Следуйте инструкциям в терминале для авторизации через OAuth.

## Доступные модели Antigravity

| Модель | Описание |
|--------|----------|
| `antigravity-gemini-3-pro` | Gemini 3 Pro с thinking |
| `antigravity-gemini-3-flash` | Gemini 3 Flash с thinking |
| `antigravity-claude-sonnet-4-6` | Claude Sonnet 4.6 |
| `antigravity-claude-opus-4-6-thinking` | Claude Opus 4.6 с extended thinking |

## Использование

```bash
opencode run "Hello" --model=google/antigravity-claude-opus-4-6-thinking --variant=max
```

## Устранение неполадок

### Сброс аккаунтов
Если возникают проблемы с аутентификацией:
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

### Очистка tmp файлов
```bash
rm ~/.config/opencode/*.tmp
```
