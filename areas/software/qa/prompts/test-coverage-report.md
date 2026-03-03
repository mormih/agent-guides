# Prompt: `/test-coverage-report`

## Сравнение с main

```
/test-coverage-report --compare main --threshold 80

Сравни coverage текущей ветки с main.
Порог: 80% для src/features/ и src/services/. Утилиты (src/utils/): 70%.
Для каждого файла ниже порога:
- Покажи конкретные непокрытые строки (номера)
- Предложи тест-кейс для покрытия самой критичной ветки
Вывод: прошёл / не прошёл coverage gate с деталями.
```

## Аудит нового модуля

```
/test-coverage-report --threshold 80

Новый модуль src/features/subscriptions/ только что смержен в main.
Проверь coverage именно по этой директории.
Если < 80% → сгенерируй скелеты тестов для топ-5 непокрытых функций.
Приоритет: payment_processing > state_transitions > error_handling > notifications > utils.
```
