# Prompt: `/cost-audit`

## Ezhemesyachnyy otchet

```
/cost-audit --period last-month --account all

Ezhemesyachnyy audit cloud-raskhodov.
Gruppirovka: po servisu, environment (staging/production), team-tegu.
Naydi: idle resursy, unattached EBS, oversized instansy (CPU < 10% za 30 dney), NAT Gateway anomalii.
Top-10 vozmozhnostey dlya ekonomii s otsenkoy v $/mes.
Terraform snippets dlya top-3 rekomendatsiy.
```

## Rassledovanie anomalii

```
/cost-audit --period last-week --account production

Anomalnyy rost raskhodov na 40% za poslednyuyu nedelyu v production.
Naydi: kakoy servis/resurs dal osnovnoy prirost?
Sravni s predydushchey nedeley po dnyam. Vyday konkretnyy resurs i rekomendatsiyu.
```
