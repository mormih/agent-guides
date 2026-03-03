# Prompt: `/bundle-analyze`

## Dlya PR

```
/bundle-analyze --pr

Proanaliziruy vliyanie tekushchego PR na razmer bandla.
Sravni s baseline vetki main.
Flagirovat: lyuboy chunk uvelichilsya > 5 KB gzipped.
Predlozhi optimizatsii s otsenkoy ekonomii v KB.
```

## Polnyy audit

```
/bundle-analyze --full

Polnyy audit production bandla.
Naydi: dubliruyushchiesya zavisimosti, neispolzuemye importy, candidates dlya tree-shaking.
Prover nalichie: moment.js (→ date-fns), lodash bez named imports (→ lodash-es), @mui polnyy import.
Otchet: chunk | tekushchiy razmer | rekomendatsiya | potentsialnaya ekonomiya.
```
