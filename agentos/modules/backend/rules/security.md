# Rule: Backend Security & OWASP Standards

**Priority**: P0 — Уязвимости безопасности являются критическим блокером.

## OWASP Top 10 Compliance

1. **A01: Broken Access Control**:
   - Все эндпоинты должны быть защищены. **Default Deny** принцип.
   - Использование моделей **RBAC** (Role-Based Access Control) или **ABAC** (Attribute-Based Access Control).
   - Токены доступа (JWT) должны проверять не только роль, но и право субъекта (Subject) на конкретный ресурс (Object), предотвращая IDOR (Insecure Direct Object Reference).

2. **A02: Cryptographic Failures**:
   - Использование сильных алгоритмов хеширования для паролей: `Argon2id` или `Bcrypt`. Никогда не использовать `MD5` или `SHA-1`.
   - Хранение секретов строго через HashiCorp Vault, AWS Secrets Manager или аналоги. Никаких секретов в коде или переменных окружения без шифрования (K8s Secrets).

3. **A03: Injection (SQL/NoSQL/OS)**:
   - Абсолютный запрет на конкатенацию строк для SQL-запросов. Использовать только параметризованные запросы (Parameterized queries) внутри ORM или драйверов базы.
   - Строгая валидация входящих данных. Использовать библиотеки типа `Pydantic` (Python), `Zod`/`class-validator` (Node.js) для верификации структуры и содержимого **на границе системы** (DTO validation).

4. **A07: Identification and Authentication Failures**:
   - Реализация механизмов Rate Limiting и Throttling (с использованием Redis) для защиты от Brute-Force и DDoS на сервисы аутентификации.

## Additional Zero Trust Constraints

- **Input Sanitization**: Любой ввод пользователя, который может быть отрендерен (даже если бэкенд отдает JSON), должен санитаризироваться для предотвращения XSS на стороне клиента.
- **Audit Logging**: Все критические действия (успешные и неудачные попытки входа, изменение настроек безопасности, списание средств) должны асинхронно логироваться с указанием `actor_id` и `ip` в неизменяемый лог.
- **CORS Handling**: Конфигурировать CORS строго, перечисляя только разрешенные домены (Whitelist). Использование `Access-Control-Allow-Origin: *` запрещено, кроме публичных open-data API.
