# Prompt: `/secret-rotation`

## Planovaya rotatsiya

```
/secret-rotation --secret-name prod/api/database

Planovaya rotatsiya production database credentials.
Ispolzovat dual-read window: servis prinimaet oba credentials vo vremya perekhodnogo perioda.
Proverit uspeshnost: 0 auth errors v techenie 5 minut posle pereklyucheniya.
Zafiksirovat v secret inventory: data rotatsii, sleduyushchaya rotatsiya cherez 90 dney.
```

## Ekstrennaya rotatsiya

```
/secret-rotation --secret-name prod/api/stripe --emergency

SROChNO: Stripe API key popal v git history (commit abc123).
Nemedlennaya rotatsiya, dopustim kratkovremennyy restart servisa.
Parallelno: proaudiruy git log poslednie 200 kommitov na nalichie lyubykh sekretov.
Posle rotatsii: uvedomit security@company.com i sozdat incident report.
```
