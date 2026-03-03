# Prompt: `/device-testing`

## Polnyy regress pered relizom

```
/device-testing --suite regression --platform all

Device matrix:
iOS: iPhone SE 3gen (iOS 16.7), iPhone 15 Pro (iOS 17.3), iPad Air 5gen (iOS 17.3)
Android: Samsung Galaxy A14 (Android 13), Pixel 7 (Android 14), Xiaomi Redmi Note 12 (Android 13)

Kritichno proverit: checkout, push notifications, offline mode, camera (KYC flow), deep links.
Blokirovat reliz esli: critical test upal na > 2 ustroystvakh iz 6.
Video i skrinshoty dlya vsekh upavshikh testov.
```

## Proverka konkretnoy platformy

```
/device-testing --suite smoke --platform android

Smoke test tolko Android posle hotfix 3.1.8.
Proverit: payment flow, bazovaya navigatsiya, offline mode.
Dostatochno 3 ustroystv: low-end (A14), mid-range (Redmi Note 12), flagship (Pixel 7).
```
