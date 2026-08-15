/* ==========================================================================
   THEME & NAVIGATION MANAGER MODULE (theme.js)
   Controls light/dark overrides, persists preferences in localStorage,
   synchronises system queries, and builds/manages responsive navigation drawer.
   ========================================================================== */

/**
 * Initializes navbar structures, binds theme selectors, and handles mobile menu triggers.
 */
export function initTheme() {
  const header = document.getElementById('header');
  if (!header) return;

  // 1. Render semantic navbar markup
  header.innerHTML = `
    <div class="container navbar">
      <a href="#" class="nav-logo" aria-label="Kishore Portfolio Home" style="display: flex; align-items: center; gap: var(--space-xs);">
        <img src="./assets/icons/favicon.png" alt="MK Logomark" style="height: 32px; width: 32px; border-radius: var(--radius-full); border: 1px solid var(--border-color);">
        <span>Kishore</span>
      </a>
      
      <!-- Primary Navigation Links -->
      <nav role="navigation">
        <ul class="nav-menu" id="nav-menu">
          <li><a href="#hero" class="nav-link active">Home</a></li>
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#skills" class="nav-link">Skills</a></li>
          <li><a href="#projects" class="nav-link">Projects</a></li>
          <li><a href="#experience" class="nav-link">Milestones</a></li>
          <li><a href="#certifications" class="nav-link">Credentials</a></li>
          <li><a href="#contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <!-- Toggle Buttons Actions -->
      <div class="nav-actions">
        <button id="theme-toggle-btn" class="btn-icon" aria-label="Switch visual theme">
          <i class="fa-solid fa-moon"></i>
        </button>
        <button class="menu-toggle" id="menu-toggle-btn" aria-label="Toggle navigation drawer" aria-expanded="false" aria-controls="nav-menu">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>

    </div>
  `;

  // 2. Bind Theme switching triggers
  setupThemeToggle();

  // 3. Bind Responsive Navigation Drawer
  setupMobileNav();

  // 4. Bind Active Section Highlighters on Scroll
  setupScrollSpy();

  // 5. Bind Logo Image zoom pop-up modal
  setupLogoPopup();
}

/**
 * Connects theme click handlers and matches stored preferences.
 */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector('i');
  
  // Read current theme state
  let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  
  // Sync initial button icon state
  updateToggleIcon(currentTheme, icon);

  toggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply layout theme attribute
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    currentTheme = newTheme;

    // Update icon graphics
    updateToggleIcon(newTheme, icon);
  });

  // Watch for system prefers-color-scheme shifts
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update theme if user hasn't explicitly set a preference
    if (!localStorage.getItem('theme')) {
      const systemTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
      currentTheme = systemTheme;
      updateToggleIcon(systemTheme, icon);
    }
  });
}

/**
 * Updates button font-awesome icon symbols.
 */
function updateToggleIcon(theme, iconEl) {
  if (!iconEl) return;
  if (theme === 'dark') {
    iconEl.className = 'fa-solid fa-sun';
  } else {
    iconEl.className = 'fa-solid fa-moon';
  }
}

/**
 * Binds click events to drawer hamburger triggers.
 */
function setupMobileNav() {
  const menuToggle = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!menuToggle || !navMenu) return;

  const icon = menuToggle.querySelector('i');

  menuToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    
    // Update Accessibility state parameters
    menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    
    // Toggle icon shapes
    if (isActive) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close nav menu drawer on link click (for mobile SPA anchor behaviors)
  navMenu.addEventListener('click', (e) => {
    const clickedLink = e.target.closest('.nav-link');
    if (clickedLink) {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      icon.className = 'fa-solid fa-bars';
    }
  });
}

/**
 * Highlights current active navigation anchor depending on viewport offset positions.
 */
function setupScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  function spy() {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;

    sections.forEach(section => {
      const sectionOffset = section.offsetTop - 90; // Align offset boundary matching navbar height
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= sectionOffset && scrollPos < sectionOffset + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', spy);
  // Initial run
  spy();
}

/**
 * Creates, appends, and manages a centered zoom overlay modal when clicking the navbar brand logo.
 */
function setupLogoPopup() {
  const logoImg = document.querySelector('.nav-logo img');
  if (!logoImg) return;

  logoImg.style.cursor = 'pointer';
  logoImg.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Create popup overlay backdrop
    const overlay = document.createElement('div');
    overlay.className = 'logo-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Logo Image Preview');
    overlay.innerHTML = `
      <div class="logo-popup-container">
        <button class="logo-popup-close" aria-label="Close image popup"><i class="fa-solid fa-xmark"></i></button>
        <img src="./assets/icons/favicon.png" alt="Large Logo Preview" class="logo-popup-img">
      </div>
    `;
    document.body.appendChild(overlay);

    // 2. Force reflow and activate zoom transition
    overlay.getBoundingClientRect();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll

    // 3. Setup close handler functions
    const closePopup = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        overlay.remove();
      }, 300);
    };

    overlay.addEventListener('click', closePopup);
    overlay.querySelector('.logo-popup-close').addEventListener('click', closePopup);
    overlay.querySelector('.logo-popup-container').addEventListener('click', (ev) => {
      ev.stopPropagation(); // Avoid closing when clicking inside the image container
    });
  });
}
