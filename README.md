# Kishore M | Premium AI & Data Science Portfolio

A production-grade, highly optimized, premium personal portfolio website. Designed with modern fluid aesthetics, modular architecture, dynamic JSON configuration, advanced client-side interactivity, and a custom visual Content Management System (CMS).

---

## 🌐 Live URL
Your portfolio website is hosted live at:
👉 **[https://kishore-2207.github.io/kishore-portfolio/](https://kishore-2207.github.io/kishore-portfolio/)**

---

## 🛠️ Visual Content Management System (CMS)
This portfolio features a custom built visual Admin Panel to update projects, certifications, skills, milestones, and profile bio information directly from your browser without editing the source code.

### How to Run and Use the Admin Panel:
1. Open **PowerShell** on your computer.
2. Navigate to your project folder:
   ```powershell
   cd C:\portfolio_kishore
   ```
3. Start the local server script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\serve.ps1
   ```
4. Open your web browser and navigate to:
   👉 **[http://localhost:8085/admin.html](http://localhost:8085/admin.html)**
5. Authenticate using your credentials:
   - **Password**: `kishore123`
6. Make your changes in the visual forms, add new entries, upload certification or project images, and click **"Save Database"** in the sidebar.

---

## 🚀 Pushing Updates to the Live Site
Once you save your changes in the local Admin Panel, push the updated database (`portfolio.json`) to GitHub to update your live website:

1. Open a terminal inside `C:\portfolio_kishore` (or stop the server in the current terminal using `Ctrl+C`).
2. Run the following Git commands:
   ```powershell
   git add .
   git commit -m "Update portfolio content via CMS"
   git push
   ```
*Within 1 minute, GitHub Pages will automatically build and publish your updates live!*

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
