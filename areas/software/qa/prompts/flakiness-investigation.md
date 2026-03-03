# Prompt: `/flakiness-investigation`

## Rassledovanie konkretnogo testa

```
/flakiness-investigation --test "checkout with promo code applies discount correctly"

Test padaet 4 iz 20 zapuskov (flakiness rate 20%) na etoy nedele.
CI logi vsekh 4 upavshikh zapuskov: [ssylka ili opisanie oshibki].

1. Klassifitsiruy root cause: race condition / state pollution / timing / env dependency
2. Zapusti test 30 raz lokalno v izolyatsii dlya vosproizvedeniya
3. Predlozhi konkretnyy fix s obyasneniem
4. Posle fiksa → podtverdi 50 zapuskov bez edinogo failure
5. Zakroy tracking issue i udali iz quarantine spiska
```

## Massovoe rassledovanie (neskolko testov)

```
/flakiness-investigation --test "auth" 

Vse testy svyazannye s auth flakuyut posle obnovleniya jest do v30.
Pattern: padayut tolko v CI, lokalno vsegda zelenye.
Gipoteza: timing issue s async auth setup v beforeAll.
Prover: est li race condition v sozdanii test user fixtures?
```
