# Workflow: Test Feature

**Description**: Strategiya sozdaniya kompleksa testov dlya sushchestvuyushchey funktsii v ramkakh Backend Testing Pyramid.

**Inputs**:
- `<target-files>`: Imena faylov ili moduley, dlya kotorykh nuzhno sgenerirovat testy.

## 1. Analiz Pokrytiya i Logiki `<target-files>`
- Prochitat iskhodnyy kod fichi, vydeliv: kritichnye uzly raschetov (Domain), zaprosy k BD/keshu (Infrastructure), vkhodnoy interfeys (Presentation).
- Zapustit tekushchie testy i sgenerirovat HTML-otchet o pokrytii sushchestvuyushchikh strok.

## 2. Unit Testing (Domennyy sloy)
- Sgenerirovat ili dopisat Unit testy dlya klassov servisov.
- Ispolzovat moki (Mock/Stub) dlya vsekh portov infrastruktury (repozitoriev).
- Proverit kraynie sluchai: Null Reference, negativnye znacheniya, pustye spiski.

## 3. Integration Testing (Infrastrukturnyy sloy)
- Napisat testy dlya klassov-repozitoriev.
- Nastroit zapusk Testcontainers (Postgres, Redis) pered testami.
- Testirovat korrektnost SQL-zaprosov (v tom chisle tranzaktsionnost i rabotu indeksov).

## 4. API End-to-End Testing (Skvoznoy)
- Napisat test, kotoryy delaet realnyy HTTP-vyzov k kontrolleru fichi.
- Proverit status kody (v tom chisle negativnye 400, 401, 403, 404).
- Proverit, chto DTO vozvrashchayut nuzhnye klyuchi JSON.

## 5. Proverka stabilnosti (Anti-Flaky)
- Zapustit integratsionnye testy parallelno ili neskolko raz podryad, chtoby isklyuchit peresecheniya sostoyaniya mezhdu testami (State Pollution).

## Svyazannye Navyki (Skills)
- Ispolzuyte piramidu testirovaniya, opisannuyu v `backend/rules/testing.md`.
- Pri napisanii integratsionnykh testov s BD uchityvayte `backend/skills/database-modeling/SKILL.md`.
- Esli test padaet — ispolzuyte `backend/skills/troubleshooting/SKILL.md` dlya debagginga.
