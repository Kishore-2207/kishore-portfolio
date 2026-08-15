/* ==========================================================================
   CONTACT FORM SERVICE MODULE (contact.js)
   Handles form validation, visual indicator states, REST API handshakes
   with EmailJS, and manages dynamic toast notification displays.
   ========================================================================== */

import { CONFIG } from './config.js';

/**
 * Initializes and binds contact form elements and verification states.
 * @param {Object} profile - Profile slice of portfolio data.
 */
export function initContact(profile) {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  const email = profile?.socials?.email || 'contact@kishorem.dev';
  const location = profile?.location || 'San Francisco Bay Area, CA';

  // 1. Inject Contact layout structure
  contactSection.innerHTML = `
    <div class="container">
      
      <!-- Section Titles -->
      <div class="text-center reveal" style="margin-bottom: var(--space-4xl);">
        <span class="section-subtitle">Get In Touch</span>
        <h2 class="section-title">Contact Me</h2>
        <div class="margin-center section-desc">
          Have a project proposal, job opportunity, or just want to say hello? Send a message and I will respond shortly.
        </div>
      </div>

      <!-- Contact Grid -->
      <div class="contact-grid">
        
        <!-- Left: Details List -->
        <div class="contact-info flex-col gap-lg reveal">
          
          <div class="card contact-info-card glass-hover-fx">
            <i class="fa-solid fa-envelope text-gradient" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-sm);"></i>
            <h3 class="card-title">Email</h3>
            <p class="text-muted">Direct communications</p>
            <a href="mailto:${email}" class="contact-link">${email}</a>
          </div>
          
          <div class="card contact-info-card glass-hover-fx">
            <i class="fa-solid fa-map-location-dot text-gradient" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-sm);"></i>
            <h3 class="card-title">Location</h3>
            <p class="text-muted">Remote / Hybrid</p>
            <a href="#" class="location-link contact-link" aria-label="Open location map window">${location}</a>
          </div>

        </div>

        <!-- Right: Interactive Form -->
        <div class="contact-form-container card reveal">
          <form id="contact-form" class="flex-col gap-md" novalidate>
            
            <!-- Name Input -->
            <div class="form-group flex-col">
              <label for="form-name" class="form-label">Full Name <span aria-hidden="true" style="color: var(--color-error);">*</span></label>
              <input type="text" id="form-name" name="from_name" class="form-input" required minlength="2" aria-required="true" aria-describedby="name-error">
              <span class="form-error-msg" id="name-error" aria-live="polite"></span>
            </div>

            <!-- Email Input -->
            <div class="form-group flex-col">
              <label for="form-email" class="form-label">Email Address <span aria-hidden="true" style="color: var(--color-error);">*</span></label>
              <input type="email" id="form-email" name="reply_to" class="form-input" required aria-required="true" aria-describedby="email-error">
              <span class="form-error-msg" id="email-error" aria-live="polite"></span>
            </div>

            <!-- Subject Input -->
            <div class="form-group flex-col">
              <label for="form-subject" class="form-label">Subject <span aria-hidden="true" style="color: var(--color-error);">*</span></label>
              <input type="text" id="form-subject" name="subject" class="form-input" required minlength="3" aria-required="true" aria-describedby="subject-error">
              <span class="form-error-msg" id="subject-error" aria-live="polite"></span>
            </div>

            <!-- Message Textarea -->
            <div class="form-group flex-col">
              <label for="form-message" class="form-label">Message <span aria-hidden="true" style="color: var(--color-error);">*</span></label>
              <textarea id="form-message" name="message" class="form-input form-textarea" required minlength="10" aria-required="true" aria-describedby="message-error"></textarea>
              <span class="form-error-msg" id="message-error" aria-live="polite"></span>
            </div>

            <!-- Send Button -->
            <div class="form-actions" style="margin-top: var(--space-xs);">
              <button type="submit" id="form-submit-btn" class="btn btn-primary" style="width: 100%; gap: var(--space-xs);">
                Send Message <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  `;

  // Bind validation and submission events
  bindFormEvents();

  // Setup dynamic embedded map modal window
  setupMapModal(location);
}

/**
 * Handles validation checking, error message injections, and async API posts.
 */
function bindFormEvents() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !submitBtn) return;

  const fields = {
    name: {
      input: document.getElementById('form-name'),
      error: document.getElementById('name-error'),
      validate: (val) => val.trim().length >= 2 ? '' : 'Name must be at least 2 characters.'
    },
    email: {
      input: document.getElementById('form-email'),
      error: document.getElementById('email-error'),
      validate: (val) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val.trim()) return 'Email address is required.';
        return regex.test(val.trim()) ? '' : 'Please enter a valid email address.';
      }
    },
    subject: {
      input: document.getElementById('form-subject'),
      error: document.getElementById('subject-error'),
      validate: (val) => val.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.'
    },
    message: {
      input: document.getElementById('form-message'),
      error: document.getElementById('message-error'),
      validate: (val) => val.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'
    }
  };

  // Real-time inline field validation checking on blur / input events
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    const triggerValidation = () => {
      const errMsg = field.validate(field.input.value);
      if (errMsg) {
        field.input.classList.add('invalid');
        field.input.classList.remove('valid');
        field.error.textContent = errMsg;
        field.input.setAttribute('aria-invalid', 'true');
      } else {
        field.input.classList.remove('invalid');
        field.input.classList.add('valid');
        field.error.textContent = '';
        field.input.setAttribute('aria-invalid', 'false');
      }
    };

    field.input.addEventListener('blur', triggerValidation);
    field.input.addEventListener('input', () => {
      // Clear invalid layout highlights when typing
      if (field.input.classList.contains('invalid')) {
        triggerValidation();
      }
    });
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Force full validation pass
    let hasErrors = false;
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const errMsg = field.validate(field.input.value);
      if (errMsg) {
        field.input.classList.add('invalid');
        field.error.textContent = errMsg;
        field.input.setAttribute('aria-invalid', 'true');
        hasErrors = true;
      }
    });

    if (hasErrors) {
      showToast('Please correct the validation errors in the form.', 'error');
      return;
    }

    // 2. Activate Loading State
    setFormLoading(true);

    // 3. Assemble parameters payload for Web3Forms
    const payload = {
      access_key: CONFIG.web3forms.accessKey,
      name: fields.name.input.value,
      email: fields.email.input.value,
      subject: fields.subject.input.value,
      message: fields.message.input.value
    };

    // 4. Submit to Web3Forms API Endpoint
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Success state
        showToast('Message sent successfully! I will reach out to you soon.', 'success');
        form.reset();
        
        // Remove valid styling classes from inputs
        Object.keys(fields).forEach(key => {
          fields[key].input.classList.remove('valid');
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Email delivery failed.');
      }

    } catch (error) {
      console.error('Email Delivery Service Error:', error);
      showToast('Failed to send message. Please try again later or email directly.', 'error');
    } finally {
      // 5. Deactivate Loading State
      setFormLoading(false);
    }
  });

  /**
   * Disables inputs and replaces submit buttons texts during loads.
   * @param {boolean} isLoading - Loading state.
   */
  function setFormLoading(isLoading) {
    Object.keys(fields).forEach(key => {
      fields[key].input.disabled = isLoading;
    });

    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner" style="width:16px; height:16px; border-width:2px; margin-right:8px;"></span> Sending...`;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send Message <i class="fa-solid fa-paper-plane" style="margin-left: 8px;"></i>`;
    }
  }
}

/**
 * Creates, appends, and animates toast indicators.
 * @param {string} message - Toast message text.
 * @param {string} type - 'success' or 'error'.
 */
export function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? 'fa-solid fa-circle-check' 
    : 'fa-solid fa-circle-xmark';

  toast.innerHTML = `
    <i class="${icon}" aria-hidden="true" style="font-size:1.25rem;"></i>
    <span style="font-size: var(--font-size-sm); font-weight:var(--font-weight-medium);">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Fade out and remove after toastDuration constant
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Cleanup nodes after transitions completes
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, CONFIG.ui.toastDuration);
}

/**
 * Creates, appends, and manages an embedded Google Maps iframe modal dialog.
 * @param {string} location - Location query string.
 */
function setupMapModal(location) {
  // Append Map Modal to body if not already present
  if (!document.getElementById('map-modal')) {
    const mapModal = document.createElement('div');
    mapModal.id = 'map-modal';
    mapModal.className = 'modal-wrapper';
    mapModal.setAttribute('aria-hidden', 'true');
    mapModal.setAttribute('role', 'dialog');
    mapModal.setAttribute('aria-modal', 'true');
    mapModal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container" style="max-width: 650px; width: 90%;">
        <button class="modal-close-btn" id="map-modal-close" aria-label="Close map modal"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-body">
          <h2 class="modal-title" style="margin-bottom: var(--space-md); font-size: var(--font-size-lg);">Location Map</h2>
          <div class="modal-content-area" style="height: 400px; width: 100%;">
            <iframe id="map-iframe" src="" style="border:0; width:100%; height:100%; border-radius: var(--radius-md);" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(mapModal);
  }

  const locationBtn = document.querySelector('.location-link');
  const mapModal = document.getElementById('map-modal');
  const mapIframe = document.getElementById('map-iframe');
  const mapClose = document.getElementById('map-modal-close');

  if (locationBtn && mapModal && mapIframe && mapClose) {
    locationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      mapIframe.src = mapUrl;

      mapModal.classList.add('active');
      mapModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      mapClose.focus();
    });

    const closeMapModal = () => {
      mapModal.classList.remove('active');
      mapModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      mapIframe.src = '';
    };

    mapClose.addEventListener('click', closeMapModal);
    mapModal.querySelector('.modal-overlay').addEventListener('click', closeMapModal);
  }
}
