# Prompt: `/secret-rotation`

## Плановая ротация

```
/secret-rotation --secret-name prod/api/database

Плановая ротация production database credentials.
Использовать dual-read window: сервис принимает оба credentials во время переходного периода.
Проверить успешность: 0 auth errors в течение 5 минут после переключения.
Зафиксировать в secret inventory: дата ротации, следующая ротация через 90 дней.
```

## Экстренная ротация

```
/secret-rotation --secret-name prod/api/stripe --emergency

СРОЧНО: Stripe API key попал в git history (commit abc123).
Немедленная ротация, допустим кратковременный restart сервиса.
Параллельно: проаудируй git log последние 200 коммитов на наличие любых секретов.
После ротации: уведомить security@company.com и создать incident report.
```
