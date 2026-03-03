# TASK: Подготовка AI Agent Infrastructure

Проанализируй кодовую базу и создай полную инфраструктуру для AI-агентов, включая AGENTS.md и директорию .agent/

## ШАГ 1: Анализ проекта

Исследуй проект и собери информацию:

1. **Стек технологий**:
   - Язык программирования (Python/Go/Node.js/Java/Rust)
   - Фреймворк (FastAPI/Django/Express/Spring/Gin/Actix)
   - База данных (PostgreSQL/MySQL/MongoDB/Redis)
   - Инструменты сборки (poetry/npm/cargo/maven/gradle)

2. **Команды**:
   - Установка зависимостей
   - Линтинг и форматирование
   - Тестирование (все тесты, один тест файл, одна функция)
   - Сборка и запуск

3. **Архитектура**:
   - Структура директорий
   - Слои приложения (presentation/application/domain/infrastructure)
   - Паттерны (Dependency Injection, Repository, Service Layer)

4. **Стиль кода**:
   - Импорты (порядок, группировка)
   - Форматирование (line length, trailing commas)
   - Нейминг (modules, classes, functions, constants)
   - Типизация (type hints, generics, nullable types)

5. **Безопасность**:
   - Аутентификация/авторизация
   - Валидация входных данных
   - Работа с секретами

6. **Специфичные паттерны проекта**:
   - Логирование
   - Обработка ошибок
   - Работа с БД
   - Background tasks

## ШАГ 2: Проверка существующих правил

Проверь наличие:
- `.cursor/rules/` или `.cursorrules`
- `.github/copilot-instructions.md`
- `CONTRIBUTING.md`
- `DEVELOPMENT.md`

Если есть - интегрируй их в AGENTS.md

## ШАГ 3: Создание AGENTS.md (~150-200 строк)

Создай файл со следующими секциями:

### Обязательные секции:

1. **Header**:
   - Название проекта
   - Краткое описание (1 строка)

2. **Build/Test/Lint Commands** (~30 строк):
   ```bash
   # Install dependencies
   [command]
   
   # Lint and format
   [command]
   
   # Run all tests
   [command]
   
   # Run single test file
   [command with example]
   
   # Run single test function  
   [command with example]
   
   # Start development server
   [command]
   ```

3. **Code Style Guidelines** (~50 строк):
   - Imports (с примером)
   - Formatting
   - Type Hints
   - Naming Conventions
   - Error Handling
   - Database Models (если применимо)
   - API Schemas (если применимо)

4. **Architecture Rules** (~30 строк):
   - Layered Architecture (с диаграммой директорий)
   - Dependency Injection
   - Security (P0 - Blocker)
   - Database (P0 - Blocker)
   - Testing (P1)

5. **Project-Specific Patterns** (~30 строк):
   - Configuration
   - Logging
   - Authentication
   - Background Tasks
   - Other unique patterns

6. **AI Agent Commands** (~20 строк):
   - Список slash-команд
   - Пример использования
   - Ссылка на .agent/prompts/README.md

7. **Agent Rules Integration** (~10 строк):
   - Ссылки на .agent/rules/

8. **Verification Checklist** (~10 строк):
   - Чеклист перед коммитом

## ШАГ 4: Создание директории .agent/

### 4.1. Создай структуру:

```
.agent/
├── prompts/
│   ├── README.md
│   ├── create-endpoint.md
│   ├── develop-feature.md
│   ├── add-migration.md
│   ├── test-feature.md
│   ├── debug-issue.md
│   ├── develop-epic.md
│   ├── refactor-module.md
│   └── code-review.md
├── workflows/
│   ├── create-endpoint.md
│   ├── develop-feature.md
│   ├── add-migration.md
│   ├── test-feature.md
│   ├── debug-issue.md
│   ├── develop-epic.md
│   └── refactor-module.md
├── skills/
│   ├── api-design/SKILL.md
│   ├── database-modeling/SKILL.md
│   ├── async-processing/SKILL.md
│   ├── observability/SKILL.md
│   └── troubleshooting/SKILL.md
└── rules/
    ├── architecture.md
    ├── security.md
    ├── data_access.md
    └── testing.md
```

### 4.2. Адаптируй контент под стек проекта:

**Для Python/FastAPI:**
- Используй примеры с Pydantic, SQLModel, async/await
- Упомяни Poetry, pytest, black, ruff, mypy
- Примеры кода на Python

**Для Go:**
- Используй примеры с Gin/Echo, GORM/sqlx
- Упомяни go mod, go test, golangci-lint
- Примеры кода на Go

**Для Node.js/TypeScript:**
- Используй примеры с Express/NestJS, TypeORM/Prisma
- Упомяни npm/yarn/pnpm, Jest/Vitest, ESLint, Prettier
- Примеры кода на TypeScript

**Для Java/Spring:**
- Используй примеры с Spring Boot, JPA/Hibernate
- Упомяни Maven/Gradle, JUnit, Checkstyle
- Примеры кода на Java

**Для Rust:**
- Используй примеры с Actix/Axum, Diesel/SeaORM
- Упомяни Cargo, cargo test, clippy, rustfmt
- Примеры кода на Rust

### 4.3. Создай .agent/prompts/README.md (~200 строк):

Включи:
- Список всех slash-команд с примерами
- Опции и параметры
- Связанные ресурсы (workflows, skills, rules)
- Структуру директории
- Best practices

## ШАГ 5: Адаптация Rules

Создай 4 файла правил (P0 - Blockers):

1. **architecture.md** (~40 строк):
   - Clean Architecture принципы
   - Микросервисы (если применимо)
   - Zero Trust Architecture
   - Слои приложения

2. **security.md** (~30 строк):
   - OWASP Top 10
   - Input Validation
   - Authentication/Authorization
   - Secrets Management

3. **data_access.md** (~30 строк):
   - N+1 проблема
   - Миграции
   - Индексы
   - Транзакции
   - Кэширование

4. **testing.md** (~30 строк):
   - Testing Pyramid
   - Coverage требования (80% для критичных путей)
   - Fixtures/Factories
   - Моки

## ШАГ 6: Адаптация Skills

Создай 5 файлов навыков:

1. **api-design/SKILL.md** (~50 строк)
2. **database-modeling/SKILL.md** (~40 строк)
3. **async-processing/SKILL.md** (~40 строк)
4. **observability/SKILL.md** (~40 строк)
5. **troubleshooting/SKILL.md** (~30 строк)

## ШАГ 7: Адаптация Workflows

Создай 7 workflow файлов с пошаговыми инструкциями:
1. create-endpoint.md
2. develop-feature.md
3. add-migration.md
4. test-feature.md
5. debug-issue.md
6. develop-epic.md
7. refactor-module.md

Каждый файл должен содержать:
- Описание
- Входные параметры
- 5-6 шагов
- Связанные навыки (skills)
- Примеры использования

## ШАГ 8: Адаптация Prompts

Создай 9 prompt файлов с примерами slash-команд:
1. README.md (уже создан)
2. create-endpoint.md
3. develop-feature.md
4. add-migration.md
5. test-feature.md
6. debug-issue.md
7. develop-epic.md
8. refactor-module.md
9. code-review.md

## ШАГ 9: Проверка

Проверь:
- [ ] Все ссылки валидны
- [ ] Примеры соответствуют стеку проекта
- [ ] Команды протестированы
- [ ] Нет секретов/credentials
- [ ] Форматирование корректно

## ШАГ 10: Финализация

1. Удали дубликаты (если были .cursor/ или другие директории)
2. Проверь что AGENTS.md ссылается на .agent/rules/
3. Проверь что все slash commands задокументированы

---

## ТРЕБОВАНИЯ К КАЧЕСТВУ:

1. **Конкретность**: Все примеры должны быть адаптированы под стек проекта
2. **Лаконичность**: AGENTS.md ~150-200 строк, README.md ~200 строк
3. **Полнота**: Все 27 файлов созданы (AGENTS.md + 26 файлов в .agent/)
4. **Точность**: Команды должны работать в проекте
5. **Читаемость**: Markdown форматирование, clear structure

---

## ПРИМЕРЫ ДЛЯ РАЗНЫХ СТЕКОВ:

### Python/FastAPI пример (для AGENTS.md):

```python
# Imports
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from loguru import logger
from sqlmodel import Field, SQLModel

from src.config import get_database_url
from src.models.user import User

# Type Hints
def get_user(user_id: UUID) -> Optional[User]:
    ...

# Async
async def create_user(session: AsyncSession, user: User) -> User:
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
```

### Node.js/TypeScript пример:

```typescript
// Imports
import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';
import { IUser } from '@/models/user.model';

// Type Hints
async function getUser(userId: string): Promise<IUser | null> {
  // ...
}

// Async/Await
async function createUser(user: IUser): Promise<IUser> {
  const createdUser = await UserRepository.create(user);
  return createdUser;
}
```

### Go пример:

```go
// Imports
import (
    "context"
    "time"
    
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    
    "myapp/config"
    "myapp/models"
)

// Functions (Go style)
func GetUser(ctx context.Context, userID uuid.UUID) (*models.User, error) {
    var user models.User
    if err := db.WithContext(ctx).First(&user, userID).Error; err != nil {
        return nil, err
    }
    return &user, nil
}
```

---

## РЕЗУЛЬТАТ:

После выполнения этого промпта, проект будет иметь:
- ✅ AGENTS.md (150-200 строк)
- ✅ .agent/prompts/ (9 файлов)
- ✅ .agent/workflows/ (7 файлов)
- ✅ .agent/skills/ (5 файлов)
- ✅ .agent/rules/ (4 файла)
- ✅ Всего: 27 файлов, ~2000 строк документации
- ✅ Полная интеграция с OpenCode CLI slash commands

---

## Как использовать:

1. Скопируй этот промпт в новый проект
2. Запусти AI агента
3. AI проанализирует кодовую базу
4. Создаст полную инфраструктуру для AI-агентов
5. Закоммить и запушь

Промпт адаптируется под любой стек: **Python, Go, Node.js, Java, Rust** 🚀
