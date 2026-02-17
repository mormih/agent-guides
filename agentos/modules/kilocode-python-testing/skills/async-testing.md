# Skill: Async Testing

## When to load

При тестировании async функций, aiohttp handlers, aiokafka consumers.

## Setup

```ini
# pytest.ini
asyncio_mode = auto  # Все async тесты запускаются без @pytest.mark.asyncio
```

## Базовый async тест

```python
async def test_async_handler_success():
    mock_repo = AsyncMock()
    mock_repo.get_by_id = AsyncMock(return_value={"id": 1, "data": "value"})

    handler = DataHandler(repository=mock_repo)
    result = await handler.process(item_id=1)

    assert result["data"] == "value"
    mock_repo.get_by_id.assert_awaited_once_with(1)

async def test_async_handler_not_found():
    mock_repo = AsyncMock()
    mock_repo.get_by_id = AsyncMock(return_value=None)

    handler = DataHandler(repository=mock_repo)
    with pytest.raises(ValueError, match="Item 1 not found"):
        await handler.process(item_id=1)
```

## AsyncMock vs MagicMock

```python
# AsyncMock: для async def функций
mock_async_fn = AsyncMock(return_value={"result": "ok"})
result = await mock_async_fn()  # ✅

# MagicMock: для обычных функций
mock_sync_fn = MagicMock(return_value=42)
result = mock_sync_fn()  # ✅

# ⚠️ Частая ошибка:
mock_wrong = MagicMock()
result = await mock_wrong.some_async_method()  # TypeError! Нужен AsyncMock
```
