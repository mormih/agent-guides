# Prompt: `/a11y-fix`

## Dlya konkretnogo komponenta

```
/a11y-fix --file src/components/DataTable/DataTable.tsx

Proaudiruy DataTable na narusheniya WCAG 2.1 AA.
Avtomaticheski isprav: otsutstvuyushchie aria-label, alt-teksty, tabindex > 0.
Dlya narusheniy trebuyushchikh ruchnogo ispravleniya — day primery koda.
Vyday: kolichestvo narusheniy do/posle, spisok izmeneniy.
```

## Dlya stranitsy

```
/a11y-fix --route /checkout

Proaudiruy stranitsu /checkout.
Osoboe vnimanie: polya formy karty, wizard shagi, soobshcheniya ob oshibkakh validatsii.
Ubedis chto oshibki formy anonsiruyutsya cherez aria-live="polite".
Prover keyboard trap v modalke podtverzhdeniya oplaty.
```
