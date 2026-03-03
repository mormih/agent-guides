# Prompt: `/threat-model-review`

## Novaya ficha

```
/threat-model-review --feature payment-splitting

Ficha: polzovatel delit platezh mezhdu neskolkimi uchastnikami.
Kazhdyy uchastnik poluchaet invite-ssylku i oplachivaet svoyu chast nezavisimo.
Dannye: summa, email uchastnikov, status oplaty.
Trust boundary: publichnyy invite link → authenticated checkout.

Primenit STRIDE ko vsem trust boundaries.
Dlya kazhdoy ugrozy: Likelihood (1-3) × Impact (1-3) = Risk Score.
Vydat: .security/threat-models/payment-splitting.md
```

## Integratsiya s vneshnim servisom

```
/threat-model-review --feature kyc-third-party-integration

Integriruem KYC provaydera Onfido: polzovatel zagruzhaet dokument → my otpravlyaem v Onfido API → poluchaem rezultat webhook'om.
Dannye: pasport/ID-foto, selfie, rezultat verifikatsii.

Osobo proanalizirovat: khranenie dokumentov (nuzhno li voobshche?), webhook podpis (kak verifitsirovat?), GDPR (right to erasure dlya KYC dannykh).
```
