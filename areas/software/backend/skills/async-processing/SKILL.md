# Skill: Async Processing & Message Brokers

**Description**: Shablony raboty s brokerami (Kafka, NATS, RabbitMQ) i vorkerami (Celery, BullMQ).

## Event-Driven Architecture (EDA)

1. **Publish/Subscribe Topology**:
   - Mikroservis A (Producer) publikuet domennoe sobytie (Domain Event), naprimer `OrderCreated`.
   - Mikroservisy B, C (Consumers) slushayut eto sobytie i vypolnyayut sayd-effekty (otpravka email, obnovlenie profilya).
   - Nikakoy iz servisov ne dolzhen znat o sushchestvovanii drugogo napryamuyu (Decoupling).

2. **Tekhnologii**:
   - **Kafka**: Dlya High-Throughput sobytiy v log (zhurnal sobytiy), Analytics pipeline. Otlichno podkhodit dlya masshtabirovaniya konsyumerov cherez Consumer Groups, garantii poryadka vnutri partitsii i Event Sourcing.
   - **RabbitMQ**: Dlya slozhnykh marshrutizatsiy soobshcheniy (Routing Keys, Topic/Direct Exchanges) i RPC. Khorosh dlya klassicheskikh fonovykh zadach.
   - **NATS / NATS JetStream**: Dlya bystrykh mikroservisnykh kommunikatsiy i In-Memory Request-Reply.
   - **Celery/BullMQ**: Dlya otlozhennykh/cron-zadach, trebuyushchikh statusa i UI, svyazannykh s konkretnym yazykovym stekom.

3. **Garantii Dostavki (Delivery Guarantees)**:
   - Priderzhivatsya garantii `At-Least-Once` (khotya by odin raz).
   - Vse Consumers dolzhny byt **Idempotentnymi** (Idempotent: povtornaya obrabotka togo zhe sobytiya/soobshcheniya ne dolzhna menyat itogovoe sostoyanie sistemy). Dostigaetsya proverkoy unikalnosti `message_id`.
   - Ne ispolzuyte DLQ kak pomoyku dlya vsekh biznes-oshibok. Tolko dlya tekhnicheskikh (infrastrukturnykh) sboev ili nevalidnykh formatov, kotorye programmist dolzhen ispravit vruchnuyu.

4. **Patterns**:
   - **Outbox Pattern**:
     Vmesto pryamoy otpravki soobshcheniya v broker iz biznes-logiki:
     1. Zapisat domennuyu sushchnost v BD.
     2. Zapisat sobytie v druguyu tablitsu `outbox_events` BD v **odnoy tranzaktsii**.
     3. Otdelnyy vorker pollit/slushaet tablitsu `outbox_events` i otpravlyaet sobytie v Kafka/NATS (napr. Debezium / CDC).
   - **Dead Letter Queue (DLQ)**:
     Vse soobshcheniya, obrabotka kotorykh upala `N` raz podryad (ili ne rasparsilas skhema), dolzhny byt otpravleny v DLQ dlya ruchnogo vmeshatelstva inzhenera. Bez DLQ slomannoe soobshchenie zablokiruet partitsiyu.
   - **Circuit Breaker**: Esli vneshniy servis nedostupen, ostanovit chtenie iz ocheredi i otlozhit (delay) retray, chtoby ne vzorvat sistemu (Backpressure).

## Kontekst Vypolneniya (Inputs)
- Fokusiruytes na asinkhronnoy logike tolko dlya peredannogo v workflow resursa (naprimer, `<feature-name>` ili `<epic-name>`).
- Pri refaktoringe `<module-file>`, ubedites, chto izvlekaemyy modul otpravlyaet sobytiya po pravilnym kanalam.
