# Prompt: `/test-feature`

## Napisanie piramidy testov dlya modulya

```
/test-feature auth_service.ts, auth_repository.ts

Napishi piramidu testov dlya Auth modulya:
- 3 Unit-testa dlya `auth_service.ts` (1 positive, 2 negative). Zamokay `UserRepository`.
- 1 Integration test dlya `auth_repository.ts` s Testcontainers (PostgreSQL). Test dolzhen vstavit yuzera, prochitat ego i proverit ispolzovanie indeksov s `EXPLAIN`.
- 1 API Test dlya endpointa `/login` na 200 OK i 401 Unauthorized.

Orientiruysya na pravila v `backend/rules/testing.md`.
```

## Dobavlenie nedostayushchikh kraevykh sluchaev

```
/test-feature order_calculator.py

Pokroy Unit-testami klass `OrderCalculator`. 
Osoboe vnimanie udeli kraevym sluchayam:
- Pustoy spisok tovarov.
- Otritsatelnye tseny (dolzhno vybrasyvat `ValidationError`).
- Primenenie skidki, kotoraya bolshe stoimosti zakaza (summa ne mozhet byt < 0).
```
