# Rule: Secure Coding Standards

**Priority**: P0 — Security vulnerabilities block merge unconditionally.

## Input Validation & Injection Prevention

1. **Validate all inputs at system boundaries**: HTTP requests, file uploads, queue payloads validated for type, length, format before processing.
2. **Parameterized queries only**: SQL never constructed via string concatenation. Use ORM or parameterized prepared statements.
3. **Output encoding**: User-controlled data rendered in HTML must be encoded. Never use `dangerouslySetInnerHTML` without `DOMPurify`.
4. **Command injection prevention**: Never pass user input to shell commands. Use allowlist validation and argument arrays.
5. **Path traversal prevention**: File paths from user input must be canonicalized against an allowed base directory.

## Authentication & Authorization

6. **Authentication on all endpoints**: Every endpoint explicitly declares auth requirement. "Private by default" with explicit `@public` annotation.
7. **Authorization checked server-side**: Re-verify permissions on every request. Never trust client-side auth state.
8. **No security through obscurity**: Hiding endpoints is not an access control mechanism.

## Error Handling

9. **No stack traces in production responses**: Generic messages to clients; details logged server-side only.
10. **No sensitive data in logs**: Passwords, tokens, credit card numbers, PII never in log output.
