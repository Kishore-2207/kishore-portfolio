/* ==========================================================================
   SKILLS COMPONENT RENDERER (skills.js)
   Renders category cards, skill lists, dynamic animated progress meters,
   and implements category-based display filters.
   ========================================================================== */

/**
 * Initializes and renders the skills section.
 * @param {Object} data - Skills slice of portfolio data.
 */
export function initSkills(data) {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  // Render Section Structure
  skillsSection.innerHTML = `
    <div class="container">
      
      <!-- Header Titles -->
      <div class="text-center reveal" style="margin-bottom: var(--space-3xl);">
        <span class="section-subtitle">Proficiencies</span>
        <h2 class="section-title">Skills & Expertise</h2>
        <div class="margin-center section-desc">
          A detailed view of my technology stack. Click categories below to filter.
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="skills-filters flex-center flex-wrap gap-sm reveal" style="margin-bottom: var(--space-2xl);">
        <button class="filter-btn active" data-filter="all">All Skills</button>
        <button class="filter-btn" data-filter="programming">Programming</button>
        <button class="filter-btn" data-filter="ai">AI & Systems</button>
        <button class="filter-btn" data-filter="web">Web Dev</button>
        <button class="filter-btn" data-filter="database">Databases</button>
        <button class="filter-btn" data-filter="tools">Tools & DevOps</button>
      </div>

      <!-- Skills Cards Grid -->
      <div class="grid-fluid skills-grid reveal">
        
        <!-- Programming Card -->
        <div class="card skill-category-card glass-hover-fx" data-category="programming">
          <div class="card-header" style="display: flex; align-items: center; gap: var(--space-sm);">
            <i class="fa-solid fa-code text-gradient" style="font-size: var(--font-size-2xl);"></i>
            <h3 class="card-title" style="margin-bottom: 0;">Languages</h3>
          </div>
          <div class="skill-items-list" style="margin-top: var(--space-lg);">
            ${renderSkillItems(data.programming)}
          </div>
        </div>

        <!-- AI Card -->
        <div class="card skill-category-card glass-hover-fx" data-category="ai">
          <div class="card-header" style="display: flex; align-items: center; gap: var(--space-sm);">
            <i class="fa-solid fa-brain text-gradient" style="font-size: var(--font-size-2xl);"></i>
            <h3 class="card-title" style="margin-bottom: 0;">AI & Machine Learning</h3>
          </div>
          <div class="skill-items-list" style="margin-top: var(--space-lg);">
            ${renderSkillItems(data.ai)}
          </div>
        </div>

        <!-- Web Dev Card -->
        <div class="card skill-category-card glass-hover-fx" data-category="web">
          <div class="card-header" style="display: flex; align-items: center; gap: var(--space-sm);">
            <i class="fa-solid fa-laptop-code text-gradient" style="font-size: var(--font-size-2xl);"></i>
            <h3 class="card-title" style="margin-bottom: 0;">Web Engineering</h3>
          </div>
          <div class="skill-items-list" style="margin-top: var(--space-lg);">
            ${renderSkillItems(data.web)}
          </div>
        </div>

        <!-- Databases Card -->
        <div class="card skill-category-card glass-hover-fx" data-category="database">
          <div class="card-header" style="display: flex; align-items: center; gap: var(--space-sm);">
            <i class="fa-solid fa-database text-gradient" style="font-size: var(--font-size-2xl);"></i>
            <h3 class="card-title" style="margin-bottom: 0;">Data Storage</h3>
          </div>
          <div class="skill-items-list" style="margin-top: var(--space-lg);">
            ${renderSkillItems(data.database)}
          </div>
        </div>

        <!-- Tools Card -->
        <div class="card skill-category-card glass-hover-fx" data-category="tools">
          <div class="card-header" style="display: flex; align-items: center; gap: var(--space-sm);">
            <i class="fa-solid fa-screwdriver-wrench text-gradient" style="font-size: var(--font-size-2xl);"></i>
            <h3 class="card-title" style="margin-bottom: 0;">Tools & Infrastructure</h3>
          </div>
          <div class="skill-items-list" style="margin-top: var(--space-lg);">
            ${renderSkillItems(data.tools)}
          </div>
        </div>

      </div>

    </div>
  `;

  // Bind filter tab interactive triggers
  bindFilters();
}

/**
 * Builds HTML list of skills with CSS custom properties for widths.
 * @param {Array} skills - Array of skill objects.
 * @returns {string} HTML markup.
 */
function renderSkillItems(skills) {
  return skills.map(skill => `
    <span class="skill-badge">${skill.name}</span>
  `).join('');
}

/**
 * Attaches filter listeners and controls card visibility states.
 */
function bindFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Force reflow and re-trigger opacity reveal
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250); // Match transition speed
        }
      });
    });
  });
}
