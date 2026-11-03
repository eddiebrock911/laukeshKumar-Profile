// ========== Particle Background Animation ==========
class ParticleBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    this.particles = [];
    this.mousePos = { x: 0, y: 0 };
    
    this.init();
    window.addEventListener('resize', () => this.init());
    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });
  }
  
  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particles = [];
    
    // Density adaptation based on screen width
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 20000);
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.8
      });
    }
    
    this.animate();
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const isLightMode = document.body.getAttribute('data-theme') === 'light';
    const particleColor = isLightMode ? 'rgba(124, 92, 255, 0.25)' : 'rgba(60, 200, 255, 0.35)';
    const lineColor = isLightMode ? 'rgba(124, 92, 255, 0.08)' : 'rgba(124, 92, 255, 0.12)';
    
    this.particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      // Mouse interaction (gentle repulsion)
      const dx = this.mousePos.x - p.x;
      const dy = this.mousePos.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.x -= dx * force * 0.02;
        p.y -= dy * force * 0.02;
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particleColor;
      this.ctx.fill();
      
      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        
        if (dist2 < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = lineColor;
          this.ctx.lineWidth = 0.4 * (1 - dist2 / 100);
          this.ctx.stroke();
        }
      }
    });
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new ParticleBackground();
});

// ========== Magnetic Button Effect ==========
function addMagneticEffect() {
  const buttons = document.querySelectorAll('.btn, .social-link, .filter-btn, .theme-toggle, .logo-icon');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.03)`;
      btn.style.transition = 'transform 0.08s ease-out';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

window.addEventListener('DOMContentLoaded', addMagneticEffect);

// ========== Text Reveal Animation on Scroll ==========
class TextReveal {
  constructor(element) {
    this.element = element;
    this.text = element.textContent.trim();
    this.element.textContent = '';
    
    this.chars = this.text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(15px) rotateX(-45deg);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        will-change: transform, opacity;
      `;
      this.element.appendChild(span);
      return span;
    });
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.reveal();
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    
    this.observer.observe(this.element);
  }
  
  reveal() {
    this.chars.forEach((char, i) => {
      setTimeout(() => {
        char.style.opacity = '1';
        char.style.transform = 'translateY(0) rotateX(0)';
      }, i * 20);
    });
    this.observer.disconnect();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Apply reveal animation to section titles for a premium feel
  document.querySelectorAll('.section-title').forEach(el => {
    new TextReveal(el);
  });
});

// ========== Smooth Cursor Trail (Desktop Only) ==========
class CursorTrail {
  constructor() {
    this.dots = [];
    this.mousePos = { x: -100, y: -100 };
    this.isVisible = false;
    
    // Create trail dots
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      const size = 10 - i * 1.1;
      dot.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, var(--primary, #7c5cff), var(--primary-2, #3cc8ff));
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        opacity: ${0.8 - i * 0.1};
        transform: translate3d(-100px, -100px, 0);
        will-change: transform;
      `;
      document.body.appendChild(dot);
      this.dots.push({ el: dot, x: -100, y: -100 });
    }
    
    window.addEventListener('mousemove', (e) => {
      if (!this.isVisible) {
        this.dots.forEach(dot => {
          dot.x = e.clientX;
          dot.y = e.clientY;
        });
        this.isVisible = true;
      }
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });
    
    this.animate();
  }
  
  animate() {
    let x = this.mousePos.x;
    let y = this.mousePos.y;
    
    this.dots.forEach((dot, i) => {
      // Linear interpolation to make the dots follow smoothly
      dot.x += (x - dot.x) * 0.35;
      dot.y += (y - dot.y) * 0.35;
      
      dot.el.style.transform = `translate3d(${dot.x - dot.el.offsetWidth / 2}px, ${dot.y - dot.el.offsetHeight / 2}px, 0)`;
      
      x = dot.x;
      y = dot.y;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

if (window.innerWidth > 768) {
  window.addEventListener('DOMContentLoaded', () => {
    new CursorTrail();
  });
}

// ========== 3D Tilt Effect for Cards ==========
function add3DTiltEffect() {
  const cards = document.querySelectorAll('.portfolio-card, .video-card, .service-card, .stat-card, .feature-item, .info-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (capped to max 10 degrees)
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.05s ease-out, box-shadow 0.2s ease';
      card.style.boxShadow = '0 15px 35px rgba(124, 92, 255, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
      card.style.boxShadow = '';
    });
  });
}

window.addEventListener('DOMContentLoaded', add3DTiltEffect);

// ========== Scroll Progress Indicator ==========
function initScrollProgress() {
  const progressEl = document.getElementById('scrollProgress');
  if (!progressEl) return;
  
  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      progressEl.style.width = `${scrollPercent}%`;
    }
  });
}

window.addEventListener('DOMContentLoaded', initScrollProgress);

// ========== Number Counter Animation ==========
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetCount = parseInt(target.getAttribute('data-count'));
        const suffix = target.textContent.includes('+') ? '+' : '';
        
        if (!isNaN(targetCount)) {
          let current = 0;
          const duration = 1200; // ms
          const stepTime = 16; // ~60fps
          const steps = duration / stepTime;
          const increment = targetCount / steps;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
              target.textContent = targetCount + suffix;
              clearInterval(timer);
            } else {
              target.textContent = Math.floor(current) + suffix;
            }
          }, stepTime);
        }
        
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

window.addEventListener('DOMContentLoaded', animateCounters);

// ========== Interactive Before/After Slider Logic ==========
function initBeforeAfterSlider() {
  const slider = document.getElementById('baSlider');
  const handle = document.getElementById('baHandle');
  const resizeContainer = document.getElementById('baResize');
  
  if (!slider || !handle || !resizeContainer) return;
  
  let isDragging = false;
  
  // Update the CSS custom variable for width scaling
  const updateSliderWidth = () => {
    const sliderWidth = slider.offsetWidth;
    slider.style.setProperty('--slider-w', `${sliderWidth}px`);
  };
  
  // Set initial width
  updateSliderWidth();
  window.addEventListener('resize', updateSliderWidth);
  
  const moveSlider = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const x = clientX - rect.left;
    let positionPercent = (x / rect.width) * 100;
    
    // Constrain position between 0% and 100%
    if (positionPercent < 0) positionPercent = 0;
    if (positionPercent > 100) positionPercent = 100;
    
    // Apply position updates
    handle.style.left = `${positionPercent}%`;
    resizeContainer.style.width = `${positionPercent}%`;
  };
  
  // Event listeners for Mouse actions
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    moveSlider(e.clientX);
    e.preventDefault();
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Event listeners for Touch actions (Mobile/Tablet devices)
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches && e.touches[0]) {
      moveSlider(e.touches[0].clientX);
    }
  }, { passive: true });
  
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      moveSlider(e.touches[0].clientX);
    }
  }, { passive: true });
  
  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

window.addEventListener('DOMContentLoaded', initBeforeAfterSlider);