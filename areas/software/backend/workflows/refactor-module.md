# Workflow: Refactor to Clean Architecture

**Description**: Strategiya bezopasnogo refaktoringa monolitnogo koda v modulnuyu ili mikroservisnuyu arkhitekturu (Strangler Fig Pattern).

**Inputs**:
- `<module-file>`: Tselevoy fayl ili modul dlya refaktoringa.

## 1. E2E Pokrytie `<module-file>`
- Prezhde chem trogat legasi-modul, neobkhodimo pokryt ego vneshnie interfeysy API integratsionnymi/E2E testami (Black Box Testing).
- Ubedites, chto testy proveryayut kontrakty vkhoda, kody oshibok i izmeneniya v BD.

## 2. Vydelenie Domena (Domain Separation)
- Naydite kuski koda vnutri tolstykh kontrollerov, kotorye vypolnyayut biznes-pravila (raschet skidok, validatsiya prav).
- Izvlekite ikh v chistye funktsii/klassy (Domain Entities/Services). Eti klassy ne dolzhny imet zavisimostey ot vneshnego mira (ni freymvorkov, ni ORM, ni loggera).

## 3. Vnedrenie Interfeysov (Ports)
- Esli izvlekaemyy kod delaet zaprosy k storonnemu API ili baze dannykh napryamuyu konnektom, obernite etot vyzov v interfeys (naprimer, `PaymentGateway`).
- Staryy kod stanovitsya `Infrastructure/Adapter`, realizuyushchim etot interfeys.

## 4. Inversiya Zavisimostey (Dependency Injection)
- Nastroyte DI konteyner ili ruchnuyu inektsiyu, chtoby "chistyy" domennyy kod poluchal adaptery raboty s vneshnim mirom snaruzhi.

## 5. Validatsiya (Red-Green-Refactor)
- Zapustite E2E testy napisannye na shage 1. Oni dolzhny byt "zelenymi".
- Dobavte bystrye Unit-testy na novoispechennyy "chistyy" domennyy kod (s zamokannymi interfeysami).

## 6. Dvoynaya zapis (Esli vydelyaetsya mikroservis)
- Esli perenos idet v otdelnyy mikroservis, realizuyte pattern marshrutizatsii: API Gateway napravlyaet zaprosy na staryy monolit. Staryy monolit i novyy mikroservis rabotayut parallelno. Ispolzuyte tenevoy rezhim (Shadowing) - zaprosy idut v oba, no klientu vozvrashchaetsya otvet ot starogo, poka ne budet dokazana polnaya identichnost otvetov novogo.

## Svyazannye Navyki (Skills)
- Ispolzuyte pravila Clear Architecture: `backend/rules/architecture.md`.
- Pishite testy opirayas na: `backend/rules/testing.md`.
- Pri vynose bazy dannykh: `backend/skills/database-modeling/SKILL.md`.
