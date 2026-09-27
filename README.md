# Kishore M | Premium AI & Data Science Portfolio

A production-grade, highly optimized, premium personal portfolio website. Designed with modern fluid aesthetics, modular architecture, dynamic JSON configuration, advanced client-side interactivity, and a custom visual Content Management System (CMS).

---

## 🌐 Live URL
Your portfolio website is hosted live at:
👉 **[https://kishore-2207.github.io/kishore-portfolio/](https://kishore-2207.github.io/kishore-portfolio/)**

---

## 🛠️ Visual Content Management System (CMS)

This portfolio features a built-in visual Admin Panel to update projects, certifications, skills, milestones, and profile bio information directly from your web browser.

### ⚡ Method 1: Cloud Mode (Recommended — Zero PowerShell / Zero Local Server)
Edit your portfolio from **any device (including mobile phones)** anywhere in the world!

1. Open your browser and navigate to:  
   👉 **[https://kishore-2207.github.io/kishore-portfolio/admin.html](https://kishore-2207.github.io/kishore-portfolio/admin.html)**
2. Authenticate using password: `kishore123`.
3. Click the **GitHub (Cloud Sync)** button in the top header.
4. Paste your **GitHub Personal Access Token** (created in 30 seconds at [GitHub Token Settings](https://github.com/settings/tokens/new) with `repo` scope).
5. Edit your content or upload images, then click **"Save Database"**.
6. Changes are committed directly to GitHub and your live site updates automatically in ~1 minute!

---

### 💻 Method 2: Local Server Mode
If you prefer running a local server on your PC without a GitHub token:

1. Open **PowerShell** and navigate to your project folder:
   ```powershell
   cd C:\portfolio_kishore
   ```
2. Start the local server script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\serve.ps1
   ```
3. Navigate to **[http://localhost:8085/admin.html](http://localhost:8085/admin.html)** in your browser.
4. Make your changes and click **"Save Database"**.
5. Push updates to GitHub:
   ```powershell
   git add .
   git commit -m "Update portfolio content via CMS"
   git push
   ```

---

## 📂 Folder Structure

```
portfolio_kishore/
├── index.html                  # Main website landing page
├── admin.html                  # CMS Dashboard Editor Panel
├── portfolio.json              # Centralized data configuration (Content database)
├── serve.ps1                   # Local CMS file server and upload api handler
├── robots.txt                  # Search engine crawl rules
├── sitemap.xml                 # Search engine site index
├── manifest.json               # Web App Manifest for PWA features
├── assets/                     # Static media and binary documents
│   └── images/                 # Project images and certificate uploads
│       └── certs/              # Credentials thumbnail images
├── css/                        # Design styles
│   ├── variables.css           # Theme styles & variables
│   ├── style.css               # Main visual component styles
│   └── responsive.css          # Device responsiveness sheets
└── js/                         # Modular Javascript scripts
    ├── main.js                 # App initializer
    ├── theme.js                # Dark/Light theme toggles
    ├── contact.js              # Web3Forms contact form handler
    └── components/             # Dynamic HTML page section templates
```
