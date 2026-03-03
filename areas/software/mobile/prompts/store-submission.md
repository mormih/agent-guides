# Prompt: `/store-submission`

## App Store (iOS)

```
/store-submission --platform ios --build-path builds/MyApp-3.2.0.ipa

Reliz 3.2.0. Progoni app-store-prep checklist pered sabmitom.

Release notes (en-US):
"What's New: Faster checkout with one-tap payment. Improved order tracking with real-time updates. Bug fixes and performance improvements."

Testovyy akkaunt dlya App Review: reviewer@example.com / TestReview123!
Instruktsiya: Apple Pay rabotaet tolko na realnom ustroystve s dobavlennoy testovoy kartoy.

Pri rejection: nemedlenno uvedomit #mobile-team i razobrat prichinu.
```

## Google Play (Android)

```
/store-submission --platform android --build-path builds/app-release-3.2.0.aab

Staged rollout: start 20% → cherez 48 chasov 50% → cherez 48 chasov 100%.
Stop-kriteriy: ANR rate > 0.47% ili crash rate > 1.09% na lyubom etape → ostanovit rollout.
Data safety form: prover chto otrazheny novye permission (push notifications, razreshili v 3.2.0).
```
