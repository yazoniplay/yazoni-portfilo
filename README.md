# Yazoni Labs — early-access app store

A static GitHub Pages storefront for sharing apps before their official release.

## Add an app

Edit `apps.js` and add an object to `window.YAZONI_APPS`. The homepage renders a card for each entry. Example:

```js
{
  name: "Your App",
  description: "A short, honest description of the app.",
  version: "0.1.0",
  platform: "Android",
  status: "EARLY ACCESS",
  icon: "Y",
  color: "#e9e8dd",
  iconColor: "#d7f36a",
  downloadUrl: "https://github.com/yazoniplay/your-app/releases/download/v0.1.0/app.apk",
  detailsUrl: "https://github.com/yazoniplay/your-app/releases"
}
```

Use direct HTTPS URLs. A GitHub Release is a convenient place to host APKs and other public build files; upload the build as a release asset in the app's repository, then paste its download URL into `downloadUrl`. Keep `downloadUrl` empty until a real build is available.

## Publishing with GitHub Pages

In the repository settings, open **Pages** and set the source to **Deploy from a branch**, branch **main**, folder **/(root)**. The site uses only HTML, CSS, and JavaScript, so no build step is needed.

## Platform notes

- **Android:** you can distribute an APK for testers. Clearly label it as an early build and explain that users may need to allow installation from their chosen browser/file manager. Only share APKs you built and trust.
- **iPhone/iPad:** a normal website cannot directly install an iOS app. Use **TestFlight** for beta testing, or the official App Store when it is ready. Put the TestFlight invitation URL in the app's details/download link when available.
- Never imply an app is available for download until a working build exists. Include version, supported platform, known issues, and a way to report bugs for each release.

## Local preview

Open `index.html` in a browser. For full testing, use a local static server so browser behavior matches hosting more closely.
