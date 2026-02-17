# Skill: Mock Patterns (Python)

## When to load

При написании тестов с внешними зависимостями.

## HTTP (requests)

```python
def test_fetch_data_success():
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"status": "ok", "data": [1, 2, 3]}

    with patch("src.client.requests.get", return_value=mock_response):
        result = fetch_data("https://api.example.com/data")
    assert result == [1, 2, 3]

def test_fetch_data_http_error_raises():
    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = requests.HTTPError("Server Error")
    with patch("src.client.requests.get", return_value=mock_response):
        with pytest.raises(requests.HTTPError):
            fetch_data("https://api.example.com/data")
```

## aiohttp

```python
async def test_async_fetch_success():
    mock_response = AsyncMock()
    mock_response.status = 200
    mock_response.json = AsyncMock(return_value={"result": "ok"})
    mock_response.__aenter__ = AsyncMock(return_value=mock_response)
    mock_response.__aexit__ = AsyncMock(return_value=False)

    mock_session = AsyncMock()
    mock_session.get = MagicMock(return_value=mock_response)
    mock_session.__aenter__ = AsyncMock(return_value=mock_session)
    mock_session.__aexit__ = AsyncMock(return_value=False)

    with patch("aiohttp.ClientSession", return_value=mock_session):
        result = await async_fetch("https://api.example.com/items")
    assert result == {"result": "ok"}
```

## asyncpg / psycopg2

```python
async def test_get_user_from_db():
    mock_conn = AsyncMock()
    mock_conn.fetchrow = AsyncMock(return_value={"id": 1, "email": "user@example.com"})
    with patch("asyncpg.connect", AsyncMock(return_value=mock_conn)):
        user = await get_user_by_id(1)
    assert user["email"] == "user@example.com"
```

## Kafka (confluent-kafka)

```python
def test_produce_message_success():
    mock_producer = MagicMock()
    mock_producer.flush.return_value = 0
    with patch("confluent_kafka.Producer", return_value=mock_producer):
        result = send_event({"user_id": 123, "action": "login"})
    mock_producer.produce.assert_called_once()
    assert result is True

def test_produce_message_kafka_error():
    mock_producer = MagicMock()
    mock_producer.produce.side_effect = Exception("Kafka unavailable")
    with patch("confluent_kafka.Producer", return_value=mock_producer):
        with pytest.raises(Exception, match="Kafka unavailable"):
            send_event({"user_id": 123})
```

## Redis

```python
def test_cache_miss_returns_none():
    mock_redis = MagicMock()
    mock_redis.get.return_value = None
    with patch("redis.Redis", return_value=mock_redis):
        result = get_cached("nonexistent_key")
    assert result is None
```

## MinIO

```python
def test_upload_file_success():
    mock_client = MagicMock()
    mock_client.put_object.return_value = MagicMock(etag="abc123")
    with patch("minio.Minio", return_value=mock_client):
        result = upload_to_storage("bucket", "file.csv", b"col1,col2\n1,2")
    assert result is True
```

## Environment Variables

```python
def test_config_reads_from_env():
    env_vars = {"DB_HOST": "localhost", "API_KEY": "test_key_abc"}
    with patch.dict("os.environ", env_vars):
        config = load_config()
    assert config.db_host == "localhost"
```
