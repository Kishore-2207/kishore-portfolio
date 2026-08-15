/* ==========================================================================
   HERO COMPONENT RENDERER (hero.js)
   Renders the Hero layout with responsive grids, animated text effects,
   interactive mouse glow gradients, and optimized particle canvas visuals.
   ========================================================================== */

/**
 * Initializes and renders the hero section.
 * @param {Object} data - Profile slice of portfolio data.
 */
export function initHero(data) {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  // Clear loader and inject HTML structure
  heroSection.innerHTML = `
    <!-- Canvas for Particle Background -->
    <canvas id="hero-particles" class="hero-canvas"></canvas>
    
    <!-- Ambient Glow Blobs -->
    <div class="glow-blob glow-primary" style="top: 15%; left: 8%;"></div>
    <div class="glow-blob glow-secondary" style="bottom: 15%; right: 8%;"></div>

    <!-- Mouse Glow Tracking Layer -->
    <div id="hero-mouse-glow" class="mouse-glow" aria-hidden="true"></div>

    <div class="container hero-container animate-hero-content">
      <div class="hero-grid">
        
        <!-- Left: Branding & Core Info -->
        <div class="hero-content">
          <span class="section-subtitle">Welcome to my space</span>
          <h1 class="hero-title">Hi, I'm <span class="text-gradient">${data.name}</span></h1>
          <h2 class="hero-headline">I build <span id="typing-target" class="typing-cursor text-gradient"></span></h2>
          <p class="hero-lead">${data.aboutShort}</p>
          
          <div class="hero-buttons">
            <a href="#projects" class="btn btn-primary" id="btn-view-work">
              View Work <i class="fa-solid fa-arrow-down" style="margin-left: 8px;"></i>
            </a>
            <a href="#contact" class="btn btn-secondary" id="btn-contact-me">Contact Me</a>
          </div>

          <div class="hero-socials">
            <a href="${data.socials.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" class="btn-icon">
              <i class="fa-brands fa-github"></i>
            </a>
            <a href="${data.socials.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" class="btn-icon">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#contact" aria-label="Go to Contact Section" class="btn-icon">
              <i class="fa-solid fa-envelope"></i>
            </a>
          </div>
        </div>

        <!-- Right: Profile Visual Frame -->
        <div class="hero-visual animate-hero-visual">
          <div class="avatar-ring-outer">
            <div class="avatar-ring-inner">
              <div class="img-hover-container avatar-wrapper">
                <img src="${data.avatar}" alt="${data.name} Profile Shot" class="avatar-img img-hover-target" width="360" height="360">
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Scroll Down Indicator Mouse -->
    <div class="scroll-indicator" aria-hidden="true">
      <a href="#about" aria-label="Scroll to About Section">
        <span class="mouse-icon">
          <span class="wheel"></span>
        </span>
      </a>
    </div>
  `;

  // Bind individual dynamic behaviours
  initTypingEffect();
  initMouseGlow();
  initParticles();
}

/**
 * Creates dynamic typing effect on heading titles.
 */
function initTypingEffect() {
  const phrases = [
    "scalable systems.",
    "frontend architectures.",
    "intelligent data oriented models.",
    "agentic AI tools."
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const targetEl = document.getElementById('typing-target');
  
  if (!targetEl) return;

  function typeLoop() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      targetEl.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      targetEl.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    // Phrase complete state
    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 1800; // Pause at end of text
      isDeleting = true;
    } 
    // Delete complete state
    else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400; // Pause before typing new phrase
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();
}

/**
 * Tracks client cursor relative coordinate and updates radial spotlight overlay.
 */
function initMouseGlow() {
  const hero = document.getElementById('hero');
  const glow = document.getElementById('hero-mouse-glow');
  
  if (!hero || !glow) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Smooth transition using 3d transforms
    glow.style.transform = `translate3d(${x - 150}px, ${y - 150}px, 0)`;
    glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

/**
 * Initializes canvas configuration, updates layout dimensions,
 * and executes particle connection animation loops.
 */
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Fit canvas context sizes
  function resize() {
    const parent = document.getElementById('hero');
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const maxParticles = 50;

  class Particle {
    constructor() {
      this.reset();
      // Distribute initial positions evenly
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20; // Float up from bottom
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.2); // Upward direction
      this.radius = Math.random() * 1.5 + 1;
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Reset when particle goes off-screen
      if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // Colors are bound to Indigo using HSL matching primary tokens
      ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Populate particles array
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Draw connections between adjacent vectors
  function drawLines() {
    const maxLinkDist = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxLinkDist) {
          const intensity = (1 - dist / maxLinkDist) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${intensity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    
    drawLines();
    
    animationFrameId = requestAnimationFrame(loop);
  }

  loop();

  // Optimisation: Pause animation rendering cycle when section is scrolled out of viewport
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!animationFrameId) {
          loop();
        }
      } else {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    });
  }, { threshold: 0.05 });

  const parentHero = document.getElementById('hero');
  if (parentHero) {
    visibilityObserver.observe(parentHero);
  }
}
