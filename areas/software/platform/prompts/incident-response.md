# Prompt: `/incident-response`

## P0 intsident

```
/incident-response --severity P0 --service api

P0 INTsIDENT: orders-api vernul 5xx rate = 35% za poslednie 10 minut.
Nachalo: ~14:32 UTC. Posledniy deploy: v2.3.7 dva chasa nazad.
Sozday #incident-channel, sformiruy top-3 gipotezy, vyday komandy dlya nemedlennoy diagnostiki.
Pervoe deystvie: proverit vozmozhnost rollback k v2.3.6.
```

## P1 degradatsiya BD

```
/incident-response --severity P1 --service db

P1: p99 latency BD vyrosla s 50ms do 8s. Connection pool exhaustion v logs.
Vyday runbook: proverka aktivnykh zaprosov, blokirovok, pool size.
Konkretnye SQL-zaprosy dlya diagnostiki postgres.
```
