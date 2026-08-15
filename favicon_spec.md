# Favicon Specification

This document details the favicon specifications, design sizes, and HTML bindings utilized in the portfolio website to ensure optimal appearance across all modern platforms, browsers, and operating systems.

## 🛠️ Favicon Assets & Sizes

The site utilizes a modern SVG-first favicon strategy with standard PNG fallbacks for legacy systems.

| Filename | Format | Dimensions | Purpose / Target |
| :--- | :--- | :--- | :--- |
| `favicon.svg` | SVG (Vector) | Scalable | Modern browsers (Chrome, Firefox, Edge, Safari 16+) |
| `favicon.ico` | ICO | Multi-resolution (16x16, 32x32, 48x48) | Legacy Windows desktop, tab bars, shortcuts |
| `apple-touch-icon.png` | PNG | 180x180 px | iOS Home Screen bookmarks |
| `icon-192.png` | PNG | 192x192 px | Android Chrome / Web App Manifest (PWA) |
| `icon-512.png` | PNG | 512x512 px | Android Chrome Splash Screen / PWA |

---

## 🔗 HTML Integration

The following tags are embedded in the `<head>` of the `index.html` structure (Phase 2) to link the assets:

```html
<!-- Modern Vector Favicon -->
<link rel="icon" type="image/svg+xml" href="./assets/icons/favicon.svg">

<!-- Legacy Favicon Fallback -->
<link rel="alternate icon" type="image/png" href="./assets/icons/favicon.png">
<link rel="shortcut icon" type="image/x-icon" href="./favicon.ico">

<!-- Apple Touch Icon (iOS Home Screen) -->
<link rel="apple-touch-icon" sizes="180x180" href="./assets/icons/apple-touch-icon.png">

<!-- PWA Web App Manifest -->
<link rel="manifest" href="./manifest.json">
```

---

## 🎨 Design Guide

The vector favicon (`favicon.svg`) features:
- **Gradient**: HSL-based linear gradient from Indigo (`#6366f1`) to Purple (`#a855f7`).
- **Typography**: A bold, centered monogram letter **K** rendered in `Outfit` / `Inter` font.
- **Background**: Rounded square container (`rx="22"`) for consistency across app grid interfaces.
