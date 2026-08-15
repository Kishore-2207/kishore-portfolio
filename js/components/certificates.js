/* ==========================================================================
   CERTIFICATIONS COMPONENT RENDERER (certificates.js)
   Renders the credential galleries, extracts authorities dynamically for
   filter selectors, and builds accessible keyboard-friendly popups.
   ========================================================================== */

/**
 * Initializes and renders the certifications section.
 * @param {Array} data - Certifications slice of portfolio data.
 * @param {Object} profile - Profile slice of portfolio data.
 */
export function initCertificates(data, profile) {
  const certSection = document.getElementById('certifications');
  if (!certSection || !data) return;

  // 1. Gather all unique authorities for filter selectors
  const uniqueAuthorities = ['All', ...new Set(data.map(cert => cert.authority))];

  // 2. Render core layout structure
  certSection.innerHTML = `
    <div class="container">
      
      <!-- Section Headers -->
      <div class="text-center reveal" style="margin-bottom: var(--space-3xl);">
        <span class="section-subtitle">Credentials</span>
        <h2 class="section-title">Certifications & Licenses</h2>
        <div class="margin-center section-desc">
          Professional verifications and academic credentials validating my competencies.
        </div>
      </div>

      <!-- Authority Filter Selector Tabs -->
      <div id="cert-filters-container" class="flex-center flex-wrap gap-sm reveal" style="margin-bottom: var(--space-2xl);">
        ${uniqueAuthorities.map(auth => `
          <button class="filter-btn ${auth === 'All' ? 'active' : ''}" data-authority="${auth}">
            ${auth}
          </button>
        `).join('')}
      </div>

      <!-- Gallery Grid -->
      <div id="certs-grid" class="grid-fluid reveal">
        <!-- Cards will be injected dynamically -->
      </div>

    </div>
  `;

  const gridContainer = document.getElementById('certs-grid');
  const filtersContainer = document.getElementById('cert-filters-container');

  if (!gridContainer || !filtersContainer) return;

  let activeAuthority = 'All';

  /**
   * Renders the cards matching current filter.
   */
  function drawGrid() {
    const filtered = data.filter(cert => activeAuthority === 'All' || cert.authority === activeAuthority);

    gridContainer.innerHTML = filtered.map(cert => `
      <div class="card cert-card glass-hover-fx reveal active" data-authority="${cert.authority}" data-id="${cert.id}">
        
        <!-- Thumbnail Frame -->
        <div class="cert-img-frame img-hover-container" style="cursor: pointer;">
          <img src="${cert.thumbnail}" alt="${cert.name} Certificate Thumbnail" class="cert-img img-hover-target" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="cert-img-fallback flex-col flex-center" style="display: none;">
            <i class="fa-solid fa-award text-gradient"></i>
            <span>${cert.authority}</span>
          </div>
        </div>

        <!-- Body -->
        <div class="cert-body" style="margin-top: var(--space-md);">
          <span class="cert-date">${cert.date}</span>
          <h3 class="card-title" style="margin-top: 4px; font-size: var(--font-size-md);">${cert.name}</h3>
          <p class="text-muted" style="font-size: var(--font-size-sm); margin-bottom: 0;">${cert.authority}</p>
        </div>

        <!-- Actions -->
        <div class="card-footer cert-links" style="display: flex; gap: var(--space-md); margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--border-color);">
          <button class="btn btn-secondary btn-sm btn-preview" data-id="${cert.id}" style="width: 100%;">
            <i class="fa-regular fa-eye" style="margin-right: 6px;"></i>Preview
          </button>
        </div>

      </div>
    `).join('');

    // Bind preview buttons after grid updates
    bindPreviews(filtered, profile);
  }

  // Bind Filter Toggles
  filtersContainer.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.filter-btn');
    if (!clickedBtn) return;

    // Toggle active state classes
    filtersContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    activeAuthority = clickedBtn.getAttribute('data-authority');
    drawGrid();
  });

  // Initial draw
  drawGrid();
}

/**
 * Binds click events to preview triggers and sets up modal contents.
 * @param {Array} currentCerts - Currently filtered certifications.
 * @param {Object} profile - Profile slice of portfolio data.
 */
function bindPreviews(currentCerts, profile) {
  const cards = document.querySelectorAll('.cert-card');
  const modal = document.getElementById('cert-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.querySelector('.modal-content-area');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!modal || !modalTitle || !modalContent || !closeBtn) return;

  function openModal(certId) {
    const cert = currentCerts.find(c => c.id === certId);
    if (!cert) return;

    modalTitle.textContent = cert.name;
    modalContent.innerHTML = `
      <div class="modal-cert-body flex-col gap-lg" style="display: flex; align-items: center;">
        
        <!-- Large Preview Image -->
        <div class="modal-img-container" style="width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background-color: var(--bg-tertiary);">
          <img src="${cert.thumbnail}" alt="${cert.name} Full Certificate Preview" style="width: 100%; height: auto; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="modal-img-fallback flex-col flex-center" style="display: none; min-height: 300px; color: var(--text-muted);">
            <i class="fa-solid fa-award text-gradient" style="font-size: 5rem; margin-bottom: var(--space-md);"></i>
            <span style="font-weight: var(--font-weight-bold);">${cert.authority}</span>
          </div>
        </div>

        <!-- Details list -->
        <div class="modal-details" style="width: 100%; text-align: left;">
          <p style="margin-bottom: var(--space-xs);"><strong class="text-gradient">Issuer:</strong> ${cert.authority}</p>
          <p style="margin-bottom: var(--space-lg);"><strong class="text-gradient">Issued Date:</strong> ${cert.date}</p>
          
          <div class="modal-actions" style="display: flex; gap: var(--space-md);">
            <!-- Download trigger (scrolls to contact form and pre-fills request) -->
            <button class="btn btn-primary btn-request-permission" data-cert-name="${cert.name}" style="width: 100%;">
              <i class="fa-solid fa-envelope" style="margin-right: 8px;"></i>Request Download Permission
            </button>
          </div>
        </div>

      </div>
    `;

    // Activate modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll

    // Focus close button for accessibility
    closeBtn.focus();

    // Trap keyboard focus inside modal
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock background scroll
    document.removeEventListener('keydown', trapFocus);
  }

  // Trap focus utility
  function trapFocus(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll('button, [href], input, select, textarea');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) { // Backwards tab
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else { // Forwards tab
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  }

  // Click triggers
  cards.forEach(card => {
    const previewBtn = card.querySelector('.btn-preview');
    const imgFrame = card.querySelector('.cert-img-frame');
    const id = card.getAttribute('data-id');

    if (previewBtn) {
      previewBtn.addEventListener('click', () => openModal(id));
    }
    if (imgFrame) {
      imgFrame.addEventListener('click', () => openModal(id));
    }
  });

  // Close triggers
  closeBtn.addEventListener('click', closeModal);
  
  // Close on clicking overlay background
  const overlay = modal.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  // Handle request permission buttons inside modal body
  modalContent.addEventListener('click', (e) => {
    const requestBtn = e.target.closest('.btn-request-permission');
    if (!requestBtn) return;

    const certName = requestBtn.getAttribute('data-cert-name');
    
    // Close modal dialog
    closeModal();

    // Populate Contact form inputs
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const nameInput = document.getElementById('form-name');

    if (subjectInput && messageInput) {
      subjectInput.value = 'Requesting Permission';
      messageInput.value = `I would like to request permission to download the certificate: ${certName}`;

      // Clear any validation visual highlights/errors since they are now filled with valid text
      subjectInput.classList.remove('invalid');
      subjectInput.classList.add('valid');
      const subjectErr = document.getElementById('subject-error');
      if (subjectErr) subjectErr.textContent = '';

      messageInput.classList.remove('invalid');
      messageInput.classList.add('valid');
      const messageErr = document.getElementById('message-error');
      if (messageErr) messageErr.textContent = '';
    }

    // Scroll smoothly to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Focus name field so the user can easily continue
    if (nameInput) {
      setTimeout(() => {
        nameInput.focus();
      }, 800); // Wait for scroll animation to complete
    }
  });
}
