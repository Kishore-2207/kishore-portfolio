/* ==========================================================================
   PROJECTS COMPONENT RENDERER (projects.js)
   Renders the featured projects database, handles real-time text searches,
   extracts tags dynamically for tab filters, and builds links/buttons.
   ========================================================================== */

/**
 * Initializes and renders the projects section.
 * @param {Array} data - Projects slice of portfolio data.
 */
export function initProjects(data) {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection || !data) return;

  // 1. Gather all unique technology tags from projects database
  const uniqueTags = ['All', ...new Set(data.flatMap(project => project.tags))];

  // 2. Render container structure with search input and grid anchors
  projectsSection.innerHTML = `
    <div class="container">
      
      <!-- Headers -->
      <div class="text-center reveal" style="margin-bottom: var(--space-3xl);">
        <span class="section-subtitle">Portfolio</span>
        <h2 class="section-title">Featured Projects</h2>
        <div class="margin-center section-desc">
          A showcase of enterprise products, open-source libraries, and applications I have architected and engineered.
        </div>
      </div>

      <!-- Search & Filters Dashboard -->
      <div class="projects-controls flex-col gap-lg reveal" style="margin-bottom: var(--space-2xl);">
        
        <!-- Interactive Search Bar Wrapper -->
        <div class="search-wrapper">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" id="project-search" placeholder="Search by project name, description, or technology stack..." aria-label="Search Projects">
        </div>

        <!-- Dynamic Tags Filter Tabs -->
        <div id="project-tags-container" class="flex-center flex-wrap gap-xs">
          ${uniqueTags.map(tag => `
            <button class="project-tag-btn ${tag === 'All' ? 'active' : ''}" data-tag="${tag}">
              ${tag}
            </button>
          `).join('')}
        </div>

      </div>

      <!-- Projects Grid -->
      <div id="projects-grid" class="grid-fluid reveal">
        <!-- Project Cards will be injected dynamically -->
      </div>

    </div>
  `;

  // 3. Initialise rendering and search bindings
  const searchInput = document.getElementById('project-search');
  const tagsContainer = document.getElementById('project-tags-container');
  const gridContainer = document.getElementById('projects-grid');

  if (!gridContainer) return;

  // Local state managers
  let activeTag = 'All';
  let searchQuery = '';

  /**
   * Generates card cards grid markup.
   */
  function drawGrid() {
    const filtered = data.filter(proj => {
      const matchesSearch = proj.title.toLowerCase().includes(searchQuery) ||
                            proj.description.toLowerCase().includes(searchQuery) ||
                            proj.tags.some(tag => tag.toLowerCase().includes(searchQuery));
      const matchesTag = activeTag === 'All' || proj.tags.includes(activeTag);

      return matchesSearch && matchesTag;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="no-results flex-col flex-center" style="grid-column: 1 / -1; min-height: 250px; text-align: center; width: 100%;">
          <i class="fa-regular fa-folder-open text-muted" style="font-size: 3.5rem; margin-bottom: var(--space-md);"></i>
          <h3 class="card-title">No Projects Found</h3>
          <p class="text-muted">We couldn't find anything matching your search guidelines.</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(proj => `
      <article class="card project-card glass-hover-fx card-hover-fx reveal active" data-id="${proj.id}">
        
        <!-- Image Header Frame with Resilient Fallback -->
        <div class="project-img-frame img-hover-container">
          <img src="${proj.image}" alt="${proj.title} Preview Image" class="project-img img-hover-target" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="project-img-fallback flex-col flex-center" style="display: none;">
            <i class="fa-solid fa-laptop-code"></i>
            <span>${proj.title.substring(0, 1)}</span>
          </div>
        </div>

        <!-- Content details -->
        <div class="project-body" style="margin-top: var(--space-md);">
          <h3 class="card-title">${proj.title}</h3>
          <p class="project-description" style="font-size: var(--font-size-sm); margin-bottom: var(--space-md);">${proj.description}</p>
          
          <!-- Technology Tag Badges -->
          <div class="project-badges flex-wrap gap-xs" style="display: flex;">
            ${proj.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
          </div>
        </div>

        <!-- Footer Link Handles -->
        <div class="card-footer project-links" style="display: flex; gap: var(--space-md);">
          ${proj.github ? `
            <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" aria-label="GitHub Repository for ${proj.title}">
              <i class="fa-brands fa-github" style="margin-right: 6px;"></i>Code
            </a>
          ` : ''}
          ${proj.demo ? `
            <a href="${proj.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" aria-label="Live Demo for ${proj.title}">
              <i class="fa-solid fa-arrow-up-right-from-square" style="margin-right: 6px;"></i>Live Demo
            </a>
          ` : ''}
        </div>

      </article>
    `).join('');
  }

  // Bind Search Input Handler
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    drawGrid();
  });

  // Bind Tags Toggles
  tagsContainer.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.project-tag-btn');
    if (!clickedBtn) return;

    // Toggle button active states
    document.querySelectorAll('.project-tag-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    activeTag = clickedBtn.getAttribute('data-tag');
    drawGrid();
  });

  // Render initial grid display
  drawGrid();
}
