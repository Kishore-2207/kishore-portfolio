# Premium Personal Portfolio Website

A production-grade, highly optimized, premium personal portfolio website. Designed with modern fluid aesthetics, modular architecture, dynamic JSON configuration, and advanced client-side interactivity.

## 🚀 Features

- **Dynamic Headless Architecture**: Content is entirely driven by `portfolio.json`. Update your projects, experience, skills, and certifications without editing HTML or JS.
- **Modern Fluid Design**: Developed using vanilla CSS3 Custom Properties with HSL colors, CSS Grids, and Flexbox for responsive layouts from 360px up to 1600px+ without media query redundancy.
- **GPU-Accelerated Motion**: High-performance (60fps) animations utilizing composited layers (`transform` and `opacity`) for hover effects, timeline trails, card expands, typing cursors, and custom gradients.
- **GitHub API Integration**: Real-time display of public repositories, follower counts, and language charts with local caching to minimize API hits.
- **Persistent Theme System**: Synchronized system preferences (`prefers-color-scheme`) and manual overrides with instant rendering to prevent FOUC (Flash of Unstyled Content).
- **SEO & Accessibility Optimized**: Built using semantic HTML5, aria descriptors, Google structured schema JSON-LD, Sitemap/Robots indexing, and verified for WCAG AA compliance.

---

## 📂 Folder Structure

```
portfolio_kishore/
├── index.html                  # Core HTML5 semantic structure
├── portfolio.json              # Centralized data configuration (Content database)
├── robots.txt                  # Search engine crawl rules
├── sitemap.xml                 # Search engine site index
├── manifest.json               # Web App Manifest for PWA features
├── favicon.ico                 # Site icon
├── assets/                     # Static media and binary documents
│   ├── images/                 # Optimized images (WebP/SVG formats)
│   ├── icons/                  # SVG visual icons
│   └── docs/                   # PDFs (Resume/CV)
├── css/                        # Modular stylesheet system
│   ├── variables.css           # Design tokens and theme colors
│   ├── style.css               # Core component layouts and structures
│   ├── responsive.css          # Breakpoint-specific overrides
│   └── animations.css          # Motion effects and keyframe specs
└── js/                         # Vanilla ES6 Javascript Modules
    ├── main.js                 # App initialization and coordinator
    ├── config.js               # API configurations and constant values
    ├── theme.js                # Theme switcher (Light/Dark)
    ├── data.js                 # Caching fetcher for portfolio.json
    ├── github.js               # GitHub REST API integrations
    ├── contact.js              # Form validation and EmailJS integrations
    └── components/             # Individual page section renderers
        ├── hero.js             # Hero visual layout
        ├── about.js            # Biography and statistics
        ├── skills.js           # Skills grid & interactive filters
        ├── projects.js         # Project gallery & search/tags filter
        ├── experience.js       # Career timelines
        └── certificates.js     # Credentials slider & modal viewer
```

---

## 🛠️ Local Development

The project is designed to run locally using a lightweight development server.

### Prerequisites

You need Node.js installed to run the local dev server.

### Getting Started

1. Clone or navigate to the repository directory:
   ```bash
   cd portfolio_kishore
   ```

2. Install development dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Customization via `portfolio.json`

To customize the website text, projects, and work history, modify the keys inside `portfolio.json` at the root directory.

### Structure Example:
```json
{
  "profile": {
    "name": "Kishore M",
    "title": "Principal Software Engineer",
    "avatar": "./assets/images/profile.webp",
    "socials": {
      "github": "https://github.com/your-username",
      "linkedin": "https://linkedin.com/in/your-profile"
    }
  },
  "projects": [
    {
      "id": "1",
      "title": "Project Title",
      "description": "Brief description of the work done.",
      "tags": ["JavaScript", "CSS3", "HTML5"],
      "github": "https://github.com/your-username/repo-name",
      "demo": "https://project-demo.com"
    }
  ]
}
```

---

## 📦 Deployment

Since this is a fully static application, it can be deployed on any static hosting platform. Recommended platforms:
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**
