# Rule: Backend Security & OWASP Standards

**Priority**: P0 — Uyazvimosti bezopasnosti yavlyayutsya kriticheskim blokerom.

## OWASP Top 10 Compliance

1. **A01: Broken Access Control**:
   - Vse endpointy dolzhny byt zashchishcheny. **Default Deny** printsip.
   - Ispolzovanie modeley **RBAC** (Role-Based Access Control) ili **ABAC** (Attribute-Based Access Control).
   - Tokeny dostupa (JWT) dolzhny proveryat ne tolko rol, no i pravo subekta (Subject) na konkretnyy resurs (Object), predotvrashchaya IDOR (Insecure Direct Object Reference).

2. **A02: Cryptographic Failures**:
   - Ispolzovanie silnykh algoritmov kheshirovaniya dlya paroley: `Argon2id` ili `Bcrypt`. Nikogda ne ispolzovat `MD5` ili `SHA-1`.
   - Khranenie sekretov strogo cherez HashiCorp Vault, AWS Secrets Manager ili analogi. Nikakikh sekretov v kode ili peremennykh okruzheniya bez shifrovaniya (K8s Secrets).

3. **A03: Injection (SQL/NoSQL/OS)**:
   - Absolyutnyy zapret na konkatenatsiyu strok dlya SQL-zaprosov. Ispolzovat tolko parametrizovannye zaprosy (Parameterized queries) vnutri ORM ili drayverov bazy.
   - Strogaya validatsiya vkhodyashchikh dannykh. Ispolzovat biblioteki tipa `Pydantic` (Python), `Zod`/`class-validator` (Node.js) dlya verifikatsii struktury i soderzhimogo **na granitse sistemy** (DTO validation).

4. **A07: Identification and Authentication Failures**:
   - Realizatsiya mekhanizmov Rate Limiting i Throttling (s ispolzovaniem Redis) dlya zashchity ot Brute-Force i DDoS na servisy autentifikatsii.

## Additional Zero Trust Constraints

- **Input Sanitization**: Lyuboy vvod polzovatelya, kotoryy mozhet byt otrenderen (dazhe esli bekend otdaet JSON), dolzhen sanitarizirovatsya dlya predotvrashcheniya XSS na storone klienta.
- **Audit Logging**: Vse kriticheskie deystviya (uspeshnye i neudachnye popytki vkhoda, izmenenie nastroek bezopasnosti, spisanie sredstv) dolzhny asinkhronno logirovatsya s ukazaniem `actor_id` i `ip` v neizmenyaemyy log.
- **CORS Handling**: Konfigurirovat CORS strogo, perechislyaya tolko razreshennye domeny (Whitelist). Ispolzovanie `Access-Control-Allow-Origin: *` zapreshcheno, krome publichnykh open-data API.
