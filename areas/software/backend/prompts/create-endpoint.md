# Prompt: `/create-endpoint`

## Sozdanie RESTful Endpointa

```
/create-endpoint create_order --api-type rest --method POST

Sozday endpoint /api/v1/orders:
- DTO: validatsiya Pydantic/Zod (user_id, items array, total_amount).
- Domen: OrderService, realizuyushchiy biznes-pravila primeneniya skidki i rascheta itogovoy summy (ssylaysya na `backend/skills/api-design/SKILL.md`).
- Infrastruktura: OrderRepositoryImpl dlya PostgreSQL (s tranzaktsiey).
- Sobytie: Otpravit OrderCreatedEvent v Kafka posle uspeshnogo kommita tranzaktsii (ispolzovat pattern Outbox iz `backend/skills/async-processing/SKILL.md`).
- Testy: Unit-test dlya OrderService i Integration-test s Testcontainers dlya repozitoriya.
```

## Sozdanie gRPC Endpointa

```
/create-endpoint GetUserMetrics --api-type grpc

Dobav gRPC metod GetUserMetrics v sushchestvuyushchiy servisnyy interfeys.
- Obnovi `.proto` skhemy.
- Kontroller dolzhen delegirovat zapros v sloy `Application`.
- Esli dannykh net v keshe Redis, skhodi v Postgres (referens: `backend/skills/database-modeling/SKILL.md`).
```
