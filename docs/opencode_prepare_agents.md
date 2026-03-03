# TASK: Podgotovka AI Agent Infrastructure

Proanaliziruy kodovuyu bazu i sozday polnuyu infrastrukturu dlya AI-agentov, vklyuchaya AGENTS.md i direktoriyu .agent/

## ShAG 1: Analiz proekta

Issleduy proekt i soberi informatsiyu:

1. **Stek tekhnologiy**:
   - Yazyk programmirovaniya (Python/Go/Node.js/Java/Rust)
   - Freymvork (FastAPI/Django/Express/Spring/Gin/Actix)
   - Baza dannykh (PostgreSQL/MySQL/MongoDB/Redis)
   - Instrumenty sborki (poetry/npm/cargo/maven/gradle)

2. **Komandy**:
   - Ustanovka zavisimostey
   - Linting i formatirovanie
   - Testirovanie (vse testy, odin test fayl, odna funktsiya)
   - Sborka i zapusk

3. **Arkhitektura**:
   - Struktura direktoriy
   - Sloi prilozheniya (presentation/application/domain/infrastructure)
   - Patterny (Dependency Injection, Repository, Service Layer)

4. **Stil koda**:
   - Importy (poryadok, gruppirovka)
   - Formatirovanie (line length, trailing commas)
   - Neyming (modules, classes, functions, constants)
   - Tipizatsiya (type hints, generics, nullable types)

5. **Bezopasnost**:
   - Autentifikatsiya/avtorizatsiya
   - Validatsiya vkhodnykh dannykh
   - Rabota s sekretami

6. **Spetsifichnye patterny proekta**:
   - Logirovanie
   - Obrabotka oshibok
   - Rabota s BD
   - Background tasks

## ShAG 2: Proverka sushchestvuyushchikh pravil

Prover nalichie:
- `.cursor/rules/` ili `.cursorrules`
- `.github/copilot-instructions.md`
- `CONTRIBUTING.md`
- `DEVELOPMENT.md`

Esli est - integriruy ikh v AGENTS.md

## ShAG 3: Sozdanie AGENTS.md (~150-200 strok)

Sozday fayl so sleduyushchimi sektsiyami:

### Obyazatelnye sektsii:

1. **Header**:
   - Nazvanie proekta
   - Kratkoe opisanie (1 stroka)

2. **Build/Test/Lint Commands** (~30 strok):
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

3. **Code Style Guidelines** (~50 strok):
   - Imports (s primerom)
   - Formatting
   - Type Hints
   - Naming Conventions
   - Error Handling
   - Database Models (esli primenimo)
   - API Schemas (esli primenimo)

4. **Architecture Rules** (~30 strok):
   - Layered Architecture (s diagrammoy direktoriy)
   - Dependency Injection
   - Security (P0 - Blocker)
   - Database (P0 - Blocker)
   - Testing (P1)

5. **Project-Specific Patterns** (~30 strok):
   - Configuration
   - Logging
   - Authentication
   - Background Tasks
   - Other unique patterns

6. **AI Agent Commands** (~20 strok):
   - Spisok slash-komand
   - Primer ispolzovaniya
   - Ssylka na .agent/prompts/README.md

7. **Agent Rules Integration** (~10 strok):
   - Ssylki na .agent/rules/

8. **Verification Checklist** (~10 strok):
   - Cheklist pered kommitom

## ShAG 4: Sozdanie direktorii .agent/

### 4.1. Sozday strukturu:

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

### 4.2. Adaptiruy kontent pod stek proekta:

**Dlya Python/FastAPI:**
- Ispolzuy primery s Pydantic, SQLModel, async/await
- Upomyani Poetry, pytest, black, ruff, mypy
- Primery koda na Python

**Dlya Go:**
- Ispolzuy primery s Gin/Echo, GORM/sqlx
- Upomyani go mod, go test, golangci-lint
- Primery koda na Go

**Dlya Node.js/TypeScript:**
- Ispolzuy primery s Express/NestJS, TypeORM/Prisma
- Upomyani npm/yarn/pnpm, Jest/Vitest, ESLint, Prettier
- Primery koda na TypeScript

**Dlya Java/Spring:**
- Ispolzuy primery s Spring Boot, JPA/Hibernate
- Upomyani Maven/Gradle, JUnit, Checkstyle
- Primery koda na Java

**Dlya Rust:**
- Ispolzuy primery s Actix/Axum, Diesel/SeaORM
- Upomyani Cargo, cargo test, clippy, rustfmt
- Primery koda na Rust

### 4.3. Sozday .agent/prompts/README.md (~200 strok):

Vklyuchi:
- Spisok vsekh slash-komand s primerami
- Optsii i parametry
- Svyazannye resursy (workflows, skills, rules)
- Strukturu direktorii
- Best practices

## ShAG 5: Adaptatsiya Rules

Sozday 4 fayla pravil (P0 - Blockers):

1. **architecture.md** (~40 strok):
   - Clean Architecture printsipy
   - Mikroservisy (esli primenimo)
   - Zero Trust Architecture
   - Sloi prilozheniya

2. **security.md** (~30 strok):
   - OWASP Top 10
   - Input Validation
   - Authentication/Authorization
   - Secrets Management

3. **data_access.md** (~30 strok):
   - N+1 problema
   - Migratsii
   - Indeksy
   - Tranzaktsii
   - Keshirovanie

4. **testing.md** (~30 strok):
   - Testing Pyramid
   - Coverage trebovaniya (80% dlya kritichnykh putey)
   - Fixtures/Factories
   - Moki

## ShAG 6: Adaptatsiya Skills

Sozday 5 faylov navykov:

1. **api-design/SKILL.md** (~50 strok)
2. **database-modeling/SKILL.md** (~40 strok)
3. **async-processing/SKILL.md** (~40 strok)
4. **observability/SKILL.md** (~40 strok)
5. **troubleshooting/SKILL.md** (~30 strok)

## ShAG 7: Adaptatsiya Workflows

Sozday 7 workflow faylov s poshagovymi instruktsiyami:
1. create-endpoint.md
2. develop-feature.md
3. add-migration.md
4. test-feature.md
5. debug-issue.md
6. develop-epic.md
7. refactor-module.md

Kazhdyy fayl dolzhen soderzhat:
- Opisanie
- Vkhodnye parametry
- 5-6 shagov
- Svyazannye navyki (skills)
- Primery ispolzovaniya

## ShAG 8: Adaptatsiya Prompts

Sozday 9 prompt faylov s primerami slash-komand:
1. README.md (uzhe sozdan)
2. create-endpoint.md
3. develop-feature.md
4. add-migration.md
5. test-feature.md
6. debug-issue.md
7. develop-epic.md
8. refactor-module.md
9. code-review.md

## ShAG 9: Proverka

Prover:
- [ ] Vse ssylki validny
- [ ] Primery sootvetstvuyut steku proekta
- [ ] Komandy protestirovany
- [ ] Net sekretov/credentials
- [ ] Formatirovanie korrektno

## ShAG 10: Finalizatsiya

1. Udali dublikaty (esli byli .cursor/ ili drugie direktorii)
2. Prover chto AGENTS.md ssylaetsya na .agent/rules/
3. Prover chto vse slash commands zadokumentirovany

---

## TREBOVANIYa K KAChESTVU:

1. **Konkretnost**: Vse primery dolzhny byt adaptirovany pod stek proekta
2. **Lakonichnost**: AGENTS.md ~150-200 strok, README.md ~200 strok
3. **Polnota**: Vse 27 faylov sozdany (AGENTS.md + 26 faylov v .agent/)
4. **Tochnost**: Komandy dolzhny rabotat v proekte
5. **Chitaemost**: Markdown formatirovanie, clear structure

---

## PRIMERY DLYa RAZNYKh STEKOV:

### Python/FastAPI primer (dlya AGENTS.md):

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

### Node.js/TypeScript primer:

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

### Go primer:

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

## REZULTAT:

Posle vypolneniya etogo prompta, proekt budet imet:
- ✅ AGENTS.md (150-200 strok)
- ✅ .agent/prompts/ (9 faylov)
- ✅ .agent/workflows/ (7 faylov)
- ✅ .agent/skills/ (5 faylov)
- ✅ .agent/rules/ (4 fayla)
- ✅ Vsego: 27 faylov, ~2000 strok dokumentatsii
- ✅ Polnaya integratsiya s OpenCode CLI slash commands

---

## Kak ispolzovat:

1. Skopiruy etot prompt v novyy proekt
2. Zapusti AI agenta
3. AI proanaliziruet kodovuyu bazu
4. Sozdast polnuyu infrastrukturu dlya AI-agentov
5. Zakommit i zapush

Prompt adaptiruetsya pod lyuboy stek: **Python, Go, Node.js, Java, Rust** 🚀
