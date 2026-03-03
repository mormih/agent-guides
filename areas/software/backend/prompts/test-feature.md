# Prompt: `/test-feature`

## Написание пирамиды тестов для модуля

```
/test-feature auth_service.ts, auth_repository.ts

Напиши пирамиду тестов для Auth модуля:
- 3 Unit-теста для `auth_service.ts` (1 positive, 2 negative). Замокай `UserRepository`.
- 1 Integration тест для `auth_repository.ts` с Testcontainers (PostgreSQL). Тест должен вставить юзера, прочитать его и проверить использование индексов с `EXPLAIN`.
- 1 API Test для эндпоинта `/login` на 200 OK и 401 Unauthorized.

Ориентируйся на правила в `backend/rules/testing.md`.
```

## Добавление недостающих краевых случаев

```
/test-feature order_calculator.py

Покрой Unit-тестами класс `OrderCalculator`. 
Особое внимание удели краевым случаям:
- Пустой список товаров.
- Отрицательные цены (должно выбрасывать `ValidationError`).
- Применение скидки, которая больше стоимости заказа (сумма не может быть < 0).
```
