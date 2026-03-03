# Prompt: `/threat-model-review`

## Новая фича

```
/threat-model-review --feature payment-splitting

Фича: пользователь делит платёж между несколькими участниками.
Каждый участник получает invite-ссылку и оплачивает свою часть независимо.
Данные: сумма, email участников, статус оплаты.
Trust boundary: публичный invite link → authenticated checkout.

Применить STRIDE ко всем trust boundaries.
Для каждой угрозы: Likelihood (1-3) × Impact (1-3) = Risk Score.
Выдать: .security/threat-models/payment-splitting.md
```

## Интеграция с внешним сервисом

```
/threat-model-review --feature kyc-third-party-integration

Интегрируем KYC провайдера Onfido: пользователь загружает документ → мы отправляем в Onfido API → получаем результат webhook'ом.
Данные: паспорт/ID-фото, selfie, результат верификации.

Особо проанализировать: хранение документов (нужно ли вообще?), webhook подпись (как верифицировать?), GDPR (right to erasure для KYC данных).
```
