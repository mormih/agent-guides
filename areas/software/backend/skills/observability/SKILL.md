# Skill: Observability (Logs, Metrics, Traces)

**Description**: Patterny sbora informatsii o rabote mikroservisa.

## Tri kita Observability

### 1. Structured Logging (Logi)
- Logirovat sobytiya isklyuchitelno v strukturirovannom vide (JSON).
- Klyuchevye polya: `timestamp`, `level`, `message`, `service_name`, `trace_id`, `actor_id` (esli est).
- Ne ispolzovat urovni logov proizvolno. `ERROR` - trebuet vnimaniya, `WARN` - preduprezhdenie, `INFO` - biznes-protsess, `DEBUG` - tolko dlya lokalnoy otladki.
- **NEVER** logirovat: paroli, PII dannye (Email, Imya) bez obfuskatsii ili kheshirovaniya, sekretnye tokeny.

### 2. Distributed Tracing (Treysing)
- Ispolzovat **OpenTelemetry**.
- Po kontekstu (HTTP headers ili metadata) peredavat `Trace ID` (unikalnyy identifikator vsego payplayna) i `Span ID` (shag etogo payplayna).
- Treys prokhodit cherez: API Gateway -> Service A -> Database -> Message Queue -> Service B. Bez `trace_id` nerealno svesti logi raznykh mikroservisov.
- Zagolovki: standarty W3C Trace Context (`traceparent`, `tracestate`).

### 3. Metrics (Metriki - Prometheus)
- Instrumenty: skreyping `Prometheus`, vizualizatsiya `Grafana`.
- Sledovat metodologii **RED** dlya kazhdogo servisa/endpointa:
  - **R (Rate)**: Kolichestvo zaprosov v sekundu (RPS).
  - **N (Network/Node)**: Setevye oshibki ili poterya svyazi s nodami BD.
  - **E (Errors)**: Kolichestvo oshibok v sekundu (ili dolya 5xx statusov).
  - **D (Duration)**: Vremya vypolneniya zaprosov (Latency, Percentiles 95th, 99th - a ne srednee).
- Sledovat metodologii **USE** dlya infrastruktury/worker'ov:
  - **U (Utilization)**: Naskolko resurs zanyat (naprimer, zagruzka CPU, zapolnennost pula konnektov k BD).
  - **S (Saturation)**: Ochered (skolko soobshcheniy zhdut obrabotki).
  - **E (Errors)**: Apparatnye ili sistemnye oshibki.

## Alerting
- Alerty dolzhny nastraivatsya na SLA/SLO, a ne na tekhnicheskie detali. "Zagruzka CPU 90%" — eto ne povod budit dezhurnogo, esli polzovateli etogo ne zamechayut. "Dolya uspeshnykh checkout < 99.5%" — povod budit dezhurnogo nemedlenno.

## Kontekst Vypolneniya (Inputs)
- Esli vy otlazhivaete problemu (`<issue-description>`), ispolzuyte eti metriki i logi dlya lokalizatsii Root Cause.
- Esli razrabatyvaete novuyu fichu (`<feature-name>` ili `<endpoint-name>`), ubedites, chto v kod dobavleny strukturirovannye logi i RED-metriki konkretno dlya etogo elementa.
