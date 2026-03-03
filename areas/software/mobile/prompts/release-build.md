# Prompt: `/release-build`

## Obe platformy

```
/release-build --platform all --env production --version 3.2.0

iOS:
- Scheme: MyApp-Production
- Signing: Distribution certificate + App Store provisioning profile
- Export: App Store Connect (IPA)

Android:
- Flavor: production, podpis release keystore iz CI secrets (ANDROID_KEYSTORE_*)
- Output: .aab bundle

Posle sborki: ustanovi na fizicheskoe ustroystvo, progoni Detox smoke testy.
Esli vse zelenoe → zagruzi iOS v TestFlight, Android v Firebase App Distribution.
```

## Tolko Android hotfix

```
/release-build --platform android --env production --version 3.1.8

HOTFIX: kriticheskiy crash v payment flow na Android (ENG-7832).
Tolko Android build, iOS ne trogat.
Posle sborki: Detox smoke test tolko payment flow.
Esli testy proshli → srazu /store-submission --platform android.
```
