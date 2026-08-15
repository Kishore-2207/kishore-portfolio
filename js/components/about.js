/* ==========================================================================
   ABOUT COMPONENT RENDERER (about.js)
   Renders biography, statistics grid, career objective cards, education notes,
   and a chronological vertical timeline with scroll reveal animations.
   ========================================================================== */

/**
 * Initializes and renders the about section.
 * @param {Object} data - About slice of portfolio data.
 */
export function initAbout(data) {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const bio = data.biography || '';
  const dotIndex = bio.indexOf('.');
  const formattedBiography = dotIndex !== -1 
    ? `<strong>${bio.substring(0, dotIndex + 1)}</strong>${bio.substring(dotIndex + 1)}`
    : bio;

  // Build Statistics Cards markup
  const statsMarkup = data.statistics.map(stat => `
    <div class="card stat-card glass-hover-fx reveal">
      <div class="stat-value text-gradient">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    </div>
  `).join('');

  // Build Education list items
  const educationMarkup = data.education.map(edu => `
    <div class="education-item">
      <div class="edu-header">
        <h4 class="edu-degree">${edu.degree}</h4>
        <span class="edu-year">${edu.year}</span>
      </div>
      <p class="edu-institution"><i class="fa-solid fa-graduation-cap" style="margin-right: 8px;"></i>${edu.institution}</p>
    </div>
  `).join('');

  // Build Timeline Items (using stagger animations)
  const timelineMarkup = data.timeline.map((item, index) => {
    // Alternating layouts for timeline nodes
    const sideClass = index % 2 === 0 ? 'timeline-left' : 'timeline-right';
    const revealClass = index % 2 === 0 ? 'timeline-reveal-left' : 'timeline-reveal-right';

    return `
      <div class="timeline-item ${sideClass} ${revealClass}">
        <div class="timeline-dot"></div>
        <div class="card timeline-card glass-hover-fx">
          <span class="timeline-date">${item.year}</span>
          <h3 class="timeline-role">${item.role}</h3>
          <h4 class="timeline-company">${item.company}</h4>
          <p class="timeline-desc">${item.description}</p>
        </div>
      </div>
    `;
  }).join('');

  // Inject content structural layout
  aboutSection.innerHTML = `
    <div class="container">
      
      <!-- Section Title Header -->
      <div class="text-center reveal" style="margin-bottom: var(--space-4xl);">
        <span class="section-subtitle">Biography</span>
        <h2 class="section-title">About Me</h2>
        <div class="margin-center section-desc">
          Get to know my professional journey, academic background, and core motivators that drive my engineering philosophy.
        </div>
      </div>

      <!-- Core Details Grid -->
      <div class="about-grid" style="margin-bottom: var(--space-5xl);">
        
        <!-- Left: Bio & Objective -->
        <div class="about-left reveal">
          <div class="card bio-block glass-hover-fx">
            <h3 class="about-headline">Engineering Solutions with Precision</h3>
            <p style="margin-bottom: 0;">${formattedBiography}</p>
          </div>
          
          <!-- Career Objective Glass Card -->
          <div class="card objective-card pulse-highlight" style="margin-top: var(--space-xl);">
            <div class="card-header" style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
              <i class="fa-solid fa-bullseye text-gradient" style="font-size: var(--font-size-2xl);"></i>
              <h3 class="card-title" style="margin-bottom: 0;">Career Objective</h3>
            </div>
            <p style="margin-bottom: 0; font-size: var(--font-size-sm); line-height: var(--line-height-snug);">
              To design high-efficiency, reliable, and accessible systems that merge software scalability with intuitive interface designs, contributing to state-of-the-art developments in AI, cloud-native frameworks, and frontend architectures.
            </p>
          </div>
        </div>

        <!-- Right: Stats & Education -->
        <div class="about-right">
          <!-- Stats Grid -->
          <div class="stats-grid" style="margin-bottom: var(--space-xl);">
            ${statsMarkup}
          </div>

          <!-- Education Card -->
          <div class="card education-card glass-hover-fx reveal">
            <h3 class="card-title" style="margin-bottom: var(--space-md);"><i class="fa-solid fa-book-bookmark text-gradient" style="margin-right: 10px;"></i>Education</h3>
            <div class="education-list">
              ${educationMarkup}
            </div>
          </div>
        </div>

      </div>

      <!-- Experience & Education Timeline -->
      <div class="timeline-container-wrapper reveal">
        <div class="text-center" style="margin-bottom: var(--space-3xl);">
          <span class="section-subtitle">Milestones</span>
          <h2 class="section-title">Career Timeline</h2>
        </div>
        
        <div class="timeline-track-outer">
          <div class="timeline-line"></div>
          <div class="timeline-list">
            ${timelineMarkup}
          </div>
        </div>
      </div>

    </div>
  `;
}
