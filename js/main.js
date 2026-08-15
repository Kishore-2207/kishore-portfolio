/* ==========================================================================
   APPLICATION ENTRY POINT (main.js)
   Orchestrates configuration loading, theme binding, JSON fetching,
   component mounting, and global interactive scroll animations.
   ========================================================================== */

import { fetchPortfolioData } from './data.js';
import { initTheme } from './theme.js';
import { initGithub } from './github.js';
import { initContact } from './contact.js';

// Import UI components
import { initHero } from './components/hero.js';
import { initAbout } from './components/about.js';
import { initSkills } from './components/skills.js';
import { initProjects } from './components/projects.js';
import { initExperience } from './components/experience.js';
import { initCertificates } from './components/certificates.js';

/**
 * Setup intersection observers for page elements.
 * Triggers entrance transitions defined in animations.css upon scroll.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .timeline-reveal-left, .timeline-reveal-right');
  
  const observerOptions = {
    root: null, // Relative to device viewport
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -40px 0px' // Offset trigger point slightly from bottom edge
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop tracking element once active to conserve processing cycles
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Global application bootsrapper.
 * Resolves asynchronous fetch operations and mounts modular component views.
 */
async function initApp() {
  try {
    // 1. Setup toggle listeners and synchronise persistent visual modes
    initTheme();

    // 2. Query centralized content database (portfolio.json)
    const portfolioData = await fetchPortfolioData();
    if (!portfolioData) {
      throw new Error('Database fetch resolved with empty or invalid payload.');
    }

    // 3. Inject markup and mount listeners for independent page sections
    initHero(portfolioData.profile);
    initAbout(portfolioData.about);
    initSkills(portfolioData.skills);
    initProjects(portfolioData.projects);
    initExperience(portfolioData.experience);
    initCertificates(portfolioData.certifications, portfolioData.profile);

    // 4. Initialise asynchronous integration services
    initGithub();
    initContact(portfolioData.profile);

    // 5. Activate observer trackers for animations
    initScrollReveal();

    // 6. Enable interactive 3D parallax tilt effects on elements
    init3DTiltEffect();

    // 7. Enable interactive viewport popouts on experience/milestone cells
    initExperienceFocusPopout();

  } catch (error) {
    console.error('Critical Portfolio Initialization Failure:', error);
  }
}

/**
 * Attaches mousemove listeners to all glassmorphic cards to dynamically calculate
 * cursor offsets and apply smooth perspective tilt transitions.
 */
function init3DTiltEffect() {
  // Select all cards across bio, stats, education, timeline, skills, and projects
  const cards = document.querySelectorAll('.glass-hover-fx');

  cards.forEach(card => {
    // Throttle frame rates using requestAnimationFrame for optimal performance
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Calculate rotation coordinates (Max 8 degrees tilt to remain subtle)
          const rotateX = ((centerY - y) / centerY) * 8;
          const rotateY = ((x - centerX) / centerX) * 8;

          // Apply transform matrices (with larger scale and higher Z-translation for dramatic pop)
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.06, 1.06, 1.06) translateZ(28px)`;
          card.style.boxShadow = `inset 0 1px 1px rgba(255, 255, 255, 0.22), 0 30px 60px rgba(0, 0, 0, 0.45), var(--glow-primary)`;
          ticking = false;
        });
        ticking = true;
      }
    });

    card.addEventListener('mouseleave', () => {
      window.requestAnimationFrame(() => {
        // Reset transforms smoothly to origin
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0)';
        card.style.boxShadow = '';
      });
    });
  });
}

/**
 * Enables screen-dimming overlay and centers experience cards on hover,
 * with full mouse-tracking 3D tilt functionality.
 */
function initExperienceFocusPopout() {
  const timelineCards = document.querySelectorAll('#experience .timeline-card');

  timelineCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();

      // 1. Create a backdrop wrapper overlay
      const backdrop = document.createElement('div');
      backdrop.className = 'focus-backdrop';
      
      // 2. Clone the experience card
      const clone = card.cloneNode(true);
      clone.classList.add('focused-card');
      clone.classList.remove('reveal', 'timeline-reveal-left', 'timeline-reveal-right');
      
      backdrop.appendChild(clone);
      document.body.appendChild(backdrop);
      
      // Force repaint to trigger animation transition
      backdrop.getBoundingClientRect();
      backdrop.classList.add('active');

      // Add close button to the top-right of focused card for convenience
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close-btn';
      closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '15px';
      closeBtn.style.right = '15px';
      closeBtn.style.zIndex = '10';
      clone.appendChild(closeBtn);

      // 3. Setup 3D mouse tracking inside centered clone card
      let ticking = false;
      clone.addEventListener('mousemove', (e) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const rect = clone.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Rotation angle (max 10 degrees tilt)
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;

            clone.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.08, 1.08, 1.08) translateZ(35px)`;
            clone.style.boxShadow = `0 35px 70px rgba(0, 0, 0, 0.6), var(--glow-primary)`;
            ticking = false;
          });
          ticking = true;
        }
      });

      // Reset transform when mouse leaves the clone container
      clone.addEventListener('mouseleave', () => {
        window.requestAnimationFrame(() => {
          clone.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1.08, 1.08, 1.08) translateZ(0)';
        });
      });

      // 4. Remove backdrop smoothly on click
      const closeFocus = () => {
        backdrop.classList.remove('active');
        clone.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0)';
        setTimeout(() => {
          backdrop.remove();
        }, 300);
      };

      backdrop.addEventListener('click', closeFocus);
      closeBtn.addEventListener('click', closeFocus);
      clone.addEventListener('click', (ev) => {
        ev.stopPropagation(); // Prevent clicks inside the card from closing it
      });
    });
  });
}

// Initialise application on DOM readiness
document.addEventListener('DOMContentLoaded', initApp);
