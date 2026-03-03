# Prompt: `/crash-triage`

## iOS crash posle reliza

```
/crash-triage --platform ios --version 3.1.2

Crash-free rate upal s 99.8% do 98.1% posle reliza 3.1.2.
Top crash: "EXC_BAD_ACCESS KERN_INVALID_ADDRESS" v CheckoutViewController.

1. Skachay dSYM iz App Store Connect, simvolitsiruy stek treys
2. Naydi vse breadcrumbs iz Crashlytics pered krashem
3. Vosproizvedi usloviya: kakie deystviya polzovatelya predshestvuyut krashu?
4. Predlozhi fix s regression testom
5. Otseni: nuzhen OTA (esli JS-prichina) ili store submission (esli native)?
```

## Android ANR

```
/crash-triage --platform android --version 3.2.0

ANR rate vyros s 0.1% do 0.8% na Android 13 ustroystvakh.
Simptom: UI freeze pri otkrytii spiska zakazov.
Proverit: main thread blocking, tyazhelye operatsii bez coroutine, sinkhronnye zaprosy k BD.
```
