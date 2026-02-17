# Rule: Test Isolation

**Priority**: P0 — Тест, зависящий от внешнего состояния, ненадёжен.

1. **Нет реальных сетевых вызовов**: Все HTTP, Kafka, Redis, БД, S3/MinIO мокируются через `unittest.mock.patch` или `MagicMock`.
2. **Нет реальной файловой системы**: Использовать `tmp_path` (pytest fixture) или `mock_open`.
3. **Нет зависимости от порядка**: Каждый тест независим. Никаких глобальных переменных между тестами.
4. **Нет реальных credentials**: Только `MagicMock` или строки-заглушки (`"test_token"`, `"postgresql://localhost/test"`).
5. **Нет side effects в `conftest.py`**: Только fixtures и конфигурация, без I/O при импорте.
