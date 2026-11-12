# Lite PDF Viewer

A lightweight Android PDF reader with a minimal interface and Android's built-in PdfRenderer.

## Features
- Opens PDF files from Android Files/Downloads using **Open with**
- Receives PDF files shared from other apps
- Simple in-app PDF picker
- No ads, analytics, login, network permission, or third-party PDF SDK
- Android launcher icon included

## Build
Open this repository in Android Studio, or run the GitHub Actions workflow **Lite PDF Android Build**.

The workflow creates:
- Debug APK for device testing
- Release AAB (unsigned; configure your own upload signing key before Play Store submission)

## Important limitations
This is a first release build candidate. Test on real devices with long, large, encrypted, rotated, and malformed PDFs before publishing. Android's built-in PdfRenderer does not support every advanced PDF feature. The app currently renders pages into memory and is best suited to ordinary document PDFs.

Package: `com.litepdf.viewer`
