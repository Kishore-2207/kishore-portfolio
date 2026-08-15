/* ==========================================================================
   EXPERIENCE COMPONENT RENDERER (experience.js)
   Renders detailed professional experience, internships, workshops,
   trainings, and achievements inside an alternating vertical timeline.
   ========================================================================== */

/**
 * Initializes and renders the experience section.
 * @param {Array} data - Experience slice of portfolio data.
 */
export function initExperience(data) {
  const experienceSection = document.getElementById('experience');
  if (!experienceSection || !data) return;

  // Visual configuration mapping for different experience types
  const typeConfigs = {
    internship: {
      icon: 'fa-solid fa-briefcase',
      label: 'Internship',
      colorClass: 'badge-internship'
    },
    workshop: {
      icon: 'fa-solid fa-chalkboard-user',
      label: 'Workshop',
      colorClass: 'badge-workshop'
    },
    training: {
      icon: 'fa-solid fa-user-gear',
      label: 'Training',
      colorClass: 'badge-training'
    },
    achievement: {
      icon: 'fa-solid fa-trophy',
      label: 'Achievement',
      colorClass: 'badge-achievement'
    }
  };

  // Build Timeline Items markup
  const itemsMarkup = data.map((item, index) => {
    const config = typeConfigs[item.type] || { icon: 'fa-solid fa-star', label: 'Milestone', colorClass: '' };
    const sideClass = index % 2 === 0 ? 'timeline-left' : 'timeline-right';
    const revealClass = index % 2 === 0 ? 'timeline-reveal-left' : 'timeline-reveal-right';

    return `
      <div class="timeline-item ${sideClass} ${revealClass}">
        <!-- Dynamic Type Icon Dot -->
        <div class="timeline-dot flex-center" aria-hidden="true">
          <i class="${config.icon}"></i>
        </div>
        
        <!-- Experience Card Details -->
        <div class="card timeline-card glass-hover-fx">
          <div class="flex-between flex-wrap gap-xs" style="margin-bottom: var(--space-xs);">
            <span class="timeline-date">${item.duration}</span>
            <span class="badge ${config.colorClass}">${config.label}</span>
          </div>
          <h3 class="timeline-role">${item.role}</h3>
          <h4 class="timeline-company">${item.company}</h4>
          <p class="timeline-desc" style="margin-top: var(--space-sm);">${item.description}</p>
        </div>
      </div>
    `;
  }).join('');

  // Inject markup
  experienceSection.innerHTML = `
    <div class="container">
      
      <!-- Section Headers -->
      <div class="text-center reveal" style="margin-bottom: var(--space-4xl);">
        <span class="section-subtitle">Qualifications</span>
        <h2 class="section-title">Experience & Milestones</h2>
        <div class="margin-center section-desc">
          Professional achievements, training completions, industry workshops, and student internships.
        </div>
      </div>

      <!-- Vertical Timeline track -->
      <div class="timeline-container-wrapper reveal">
        <div class="timeline-track-outer">
          <div class="timeline-line"></div>
          <div class="timeline-list">
            ${itemsMarkup}
          </div>
        </div>
      </div>

    </div>
  `;
}
