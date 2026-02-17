# Rule: Naming Conventions

**Priority**: P1 — Единообразие упрощает навигацию и автоматический анализ.

## File Naming

```
tests/
├── test_<module_name>.py    ← для src/<module_name>.py
└── conftest.py              ← fixtures, shared mocks
```

## Test Function Naming

Pattern: `test_<function_name>_<scenario>_<expected_result>`

```python
# ✅ Positive
def test_process_payment_valid_card_returns_success():
def test_parse_kafka_message_valid_json_returns_dict():

# ✅ Negative
def test_process_payment_expired_card_raises_value_error():
def test_fetch_user_db_unavailable_raises_connection_error():
def test_fetch_user_nonexistent_id_returns_none():
```
