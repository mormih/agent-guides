# Prompt: `/flakiness-investigation`

## Расследование конкретного теста

```
/flakiness-investigation --test "checkout with promo code applies discount correctly"

Тест падает 4 из 20 запусков (flakiness rate 20%) на этой неделе.
CI логи всех 4 упавших запусков: [ссылка или описание ошибки].

1. Классифицируй root cause: race condition / state pollution / timing / env dependency
2. Запусти тест 30 раз локально в изоляции для воспроизведения
3. Предложи конкретный fix с объяснением
4. После фикса → подтверди 50 запусков без единого failure
5. Закрой tracking issue и удали из quarantine списка
```

## Массовое расследование (несколько тестов)

```
/flakiness-investigation --test "auth" 

Все тесты связанные с auth флакуют после обновления jest до v30.
Паттерн: падают только в CI, локально всегда зелёные.
Гипотеза: timing issue с async auth setup в beforeAll.
Проверь: есть ли race condition в создании test user fixtures?
```
