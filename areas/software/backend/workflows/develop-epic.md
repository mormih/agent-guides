# Workflow: Develop Epic

**Description**: Soglasovannyy plan razrabotki krupnogo nabora fich (Epic), zatragivayushchego mnozhestvo sloev, servisov i bazu dannykh. Trebuet arkhitekturnogo planirovaniya do nachala napisaniya koda.

**Inputs**:
- `<epic-name>`: Nazvanie Epika dlya proektirovaniya.

## 1. System Design & Threat Modeling dlya `<epic-name>`
- Napisat vysokourovnevyy dizayn dokumenta (RFC / Architecture Decision Record).
- Vydelit mikroservisy, kotorye budut zatronuty.
- Sostavit potoki dannykh (Data Flows) i sekvens-diagrammy (Mermaid Sequence Diagram).
- Vypolnit analiz ugroz (STRIDE) na styke granits doveriya.

## 2. Planirovanie API i kontraktov
- Soglasovat API so vsemi potrebitelyami (Frontend, Mobile, drugie servisy).
- Zafiksirovat Protobuf/OpenAPI kontrakty v edinom reestre do napisaniya bekenda (chtoby Frontend mog ispolzovat moki).

## 3. Dekompozitsiya na Features
- Razbit Epic na nezavisimye Features i naznachit posledovatelnost realizatsii.
- Vydelit infrastrukturnye zadachi (novye topiki Kafka, novye bazy dannykh, sekrety).

## 4. Inkrementalnaya razrabotka i integratsiya
- Primenyat `develop-feature` dlya kazhdogo modulya.
- Nastroit Feature Flags (LaunchDarkly/Unleash), chtoby kod mozhno bylo slivat v main bez otobrazheniya dlya polzovateley do gotovnosti Epika tselikom.
- Vnedrit kontraktnye testy (Pact) mezhdu komandami.

## 5. Skvoznoe E2E testirovanie i nagruzochnoe (SVT)
- Posle integratsii provesti nagruzochnoe testirovanie i progony E2E stsenariev vsego Epika.
- Proverit otkazoustoychivost: chto proiskhodit, esli baza otvalivaetsya poseredine oformleniya zakaza.

## Svyazannye Navyki (Skills)
- Pri proektirovanii opiraytes na `backend/rules/architecture.md` (Microservices/Zero Trust).
- Dlya vybora khranilishcha ispolzuyte `backend/rules/data_access.md` i `backend/skills/database-modeling/SKILL.md`.
- Dlya proektirovaniya API kontraktov primenyayte `backend/skills/api-design/SKILL.md`.
- Tranzaktsii i raspredelennye sobytiya nastraivayte po `backend/skills/async-processing/SKILL.md`.
