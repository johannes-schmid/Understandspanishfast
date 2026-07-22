# Most Common Spanish — iOS App (with App Clip)

## What's here

A full Expo app that doubles as an iOS App Clip. Scan the QR code on mostcommonspanish.com/practice → App Clip opens instantly on iPhone — no download needed.

## Freemium flow

| State | Trigger | Gate |
|-------|---------|------|
| Anonymous | 0 cards | None |
| Signup gate | 20 cards studied | Create free account (opens web sign-up) |
| Payment gate | 100 words known | €5 unlock (opens web checkout) |
| Unlocked | After payment | All 1,500 words |

## App Clip setup checklist

### Before submitting to App Store

1. **Apple Developer account** — enrol at developer.apple.com ($99/yr)
2. **App ID** — create `com.mostcommonspanish.app` with App Clips capability enabled
3. **App Clip ID** — create `com.mostcommonspanish.app.Clip`
4. **Associated Domains** — add `appclips:mostcommonspanish.com` to both targets
5. **AASA file** — update `public/.well-known/apple-app-site-association` with your real Apple Team ID (replace `REPLACE_WITH_TEAM_ID`)
6. **eas.json** — fill in `ascAppId` and `appleTeamId`

### Building

```bash
cd mobile
npm install

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for TestFlight (first build, sets up provisioning automatically)
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Local dev

```bash
cd mobile
npm install
npx expo start --ios
```

## File structure

```
mobile/
  App.js                    Root component (full app)
  AppClip/AppClip.js        App Clip entry point
  app.json                  Expo config with App Clip plugin
  eas.json                  EAS Build / Submit config
  src/
    screens/
      VocabScreen.js        Main flashcard screen (stats + cards + gates)
      GateScreen.js         Signup / payment gate screens
    components/
      FlashCard.js          Animated flip card
      StatsBar.js           Known / In Review / Comprehension % bar
    data/
      words.js              Top 120 high-frequency Spanish words
    storage/
      progress.js           AsyncStorage helpers (progress persistence)
```

## App Clip URL

The App Clip is triggered by: `https://mostcommonspanish.com/practice`

This matches the AASA config. The QR code on the homepage points to this URL.

## After App Store approval

Apple approves App Clips separately. Once the full app is in the store, the App Clip will activate automatically when a user scans the QR code with their iPhone camera (iOS 14+).
