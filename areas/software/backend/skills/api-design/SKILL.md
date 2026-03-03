# Skill: API Design (REST & gRPC)

**Description**: Patterny proektirovaniya nadezhnykh i masshtabiruemykh interfeysov.

## RESTful API Best Practices

1. **Resursno-orientirovannost (Resource-Oriented)**:
   - URL dolzhny ukazyvat na sushchnosti (`/users`, `/orders`), a ne na deystviya (`/getUsers`, `/createOrder`).
   - Ispolzovat standartnye HTTP metody semanticheski: `GET` (chtenie), `POST` (sozdanie), `PUT` (polnoe obnovlenie), `PATCH` (chastichnoe obnovlenie), `DELETE` (udalenie).
2. **Paginatsiya i Filtratsiya**:
   - Pri otdache spiskov vsegda ispolzovat kursornuyu paginatsiyu (Cursor/Keyset Pagination) dlya bolshikh tablits, libo Offset/Limit dlya malenkikh.
   - Filtry peredavat cherez Query Parameters: `GET /users?status=active&sort=-created_at`.
3. **Versionirovanie**:
   - Versionirovanie cherez URL (naprimer: `/api/v1/users`) ili cherez HTTP Header `Accept: application/vnd.company.v1+json`. Pervyy sposob predpochtitelnee dlya vneshnikh API.

## gRPC Guidelines

1. **Protobuf Contracts**:
   - `.proto` fayly yavlyayutsya istochnikom pravdy dlya mezhservisnogo vzaimodeystviya.
   - Khranit kontrakty v edinom Schema Registry (naprimer, otdelnyy repozitoriy).
2. **Backward Compatibility**:
   - Zapreshcheno menyat tip ili udalyat polya v Protobuf-soobshcheniyakh.
   - Ispolzovat prefiks `deprecated` dlya ustarevshikh poley, ne pereispolzovat nomera tegov.

## Error Handling

- **Edinyy format oshibok (RFC 7807 Problem Details)**:
  ```json
  {
    "type": "https://example.com/probs/out-of-credit",
    "title": "You do not have enough credit.",
    "status": 403,
    "detail": "Your current balance is 30, but that costs 50.",
    "instance": "/account/12345/msgs/abc",
    "trace_id": "87f217..."
  }
  ```
- **Status kody HTTP**: 
  - `400` - Oshibka validatsii klienta.
  - `401` - Otsutstvuet ili nevalidnyy token (Autentifikatsiya).
  - `403` - Zapreshcheno pravilami RBAC/ABAC (Avtorizatsiya).
  - `404` - Resurs ne nayden (ili popytka dostupa k chuzhomu resursu).
  - `409` - Konflikt sostoyaniy (naprimer, resurs s takim email uzhe sushchestvuet).
  - `422` - Semanticheskaya oshibka (Unprocessable Entity).
  - `500` - Vnutrennyaya oshibka servisa. Dolzhna vozvrashchat obshchuyu informatsiyu polzovatelyu, no detalnyy log v Sentry.

## Kontekst Vypolneniya (Inputs)
- Esli navyk vyzyvaetsya v ramkakh konteksta `<module-file>`, `<feature-name>` ili `<endpoint-name>`, proektiruyte DTO i routy imenno vokrug etogo resursa.
- Ne vykhodite za ramki (Bounded Context), ukazannogo vo vkhodnykh parametrakh workflow.
