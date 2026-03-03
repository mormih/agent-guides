# Skill: Troubleshooting & Debugging

**Description**: Patterny i tekhniki effektivnogo resheniya problem v mikroservisakh.

## 1. Sbor konteksta (Context Gathering)
- Vsegda nachinayte s poiska **Trace ID**. Bez nego otladka v raspredelennoy sisteme prevrashchaetsya v ugadyvanie.
- Sobirayte polnuyu tsepochku (Sequence): kto vyzval servis (Edge Gateway/Drugoy servis) -> chto servis sprosil u BD (SQL zapros) -> chto vernul (Response).

## 2. Kategorizatsiya Oshibok
- **500 Internal Server Error**: Skoree vsego Unhandled Exception (Null Pointer, Syntax Error) ili nedostupnost BD. Smotret v pervuyu ochered Stack Trace v logakh.
- **502 Bad Gateway / 504 Gateway Timeout**: Servis upal (OOM Kill), libo peregruzhen i ne mozhet otvetit vovremya. Smotret metriki CPU/Memory i Connection Pool bazy dannykh.
- **422 Unprocessable Entity**: Oshibka validatsii dannykh. Problema na storone klienta, libo v kontrakte API. Izuchit peredannyy JSON Payload i logi validatora (Zod/Pydantic).
- **401/403**: Oshibka autentifikatsii/avtorizatsii. Istek token, libo net roli na vypolnenie operatsii. Proverit JWT claims.

## 3. Rasprostranennye Bolezni Bekenda
- **N+1 Zaprosy**: Simptom - servis rabotaet normalno na malykh obemakh dannykh, no umiraet na bolshikh spiskakh. Lechenie: Ispolzovat JOIN ili DataLoaders.
- **Race Conditions**: Simptom - izredka balans ukhodit v minus ili sozdayutsya dublikaty zapisey pri parallelnykh zaprosakh. Lechenie: `SELECT FOR UPDATE` (Pessimistic Lock) ili versionirovanie strok (Optimistic Lock). Unikalnye konstreynty v BD.
- **Memory Leaks / OOM**: Simptom - potreblenie pamyati postepenno rastet do restarta poda v K8s. Lechenie: Proveryat zakrytie tranzaktsiy, ne zagruzhat ves fayl/rezultat SQL tselikom v OZU (ispolzovat strimy/kursory).

## 4. Ispolzovanie Observability
- V Grafana/Kibana: Iskat piki oshibok (Spikes) na grafikakh, sopostavlyat ikh s grafikami deploev (Annotations). 90% bagov voznikaet srazu posle reliza novoy versii.
- Analizirovat Percentiles: Esli Srednee vremya (Average) - 100ms, no p99 - 5 sekund, znachit 1% polzovateley stradayut ot blokirovok/taymautov storonnikh sistem.

## Kontekst Vypolneniya (Inputs)
- Dlya peredannogo na otladku `<issue-description>` ili spiska padayushchikh `<target-files>`, vsegda nachinayte s kategorizatsii oshibki, a zatem pishite regressionnyy test dlya ee fiksatsii.
