# Prompt: `/release-build`

## Обе платформы

```
/release-build --platform all --env production --version 3.2.0

iOS:
- Scheme: MyApp-Production
- Signing: Distribution certificate + App Store provisioning profile
- Export: App Store Connect (IPA)

Android:
- Flavor: production, подпись release keystore из CI secrets (ANDROID_KEYSTORE_*)
- Output: .aab bundle

После сборки: установи на физическое устройство, прогони Detox smoke тесты.
Если всё зелёное → загрузи iOS в TestFlight, Android в Firebase App Distribution.
```

## Только Android hotfix

```
/release-build --platform android --env production --version 3.1.8

HOTFIX: критический crash в payment flow на Android (ENG-7832).
Только Android build, iOS не трогать.
После сборки: Detox smoke тест только payment flow.
Если тесты прошли → сразу /store-submission --platform android.
```
