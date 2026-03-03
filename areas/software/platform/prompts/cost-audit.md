# Prompt: `/cost-audit`

## Ежемесячный отчёт

```
/cost-audit --period last-month --account all

Ежемесячный аудит cloud-расходов.
Группировка: по сервису, environment (staging/production), team-тегу.
Найди: idle ресурсы, unattached EBS, oversized инстансы (CPU < 10% за 30 дней), NAT Gateway аномалии.
Топ-10 возможностей для экономии с оценкой в $/мес.
Terraform snippets для топ-3 рекомендаций.
```

## Расследование аномалии

```
/cost-audit --period last-week --account production

Аномальный рост расходов на 40% за последнюю неделю в production.
Найди: какой сервис/ресурс дал основной прирост?
Сравни с предыдущей неделей по дням. Выдай конкретный ресурс и рекомендацию.
```
