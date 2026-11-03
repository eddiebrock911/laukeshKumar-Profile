// Typing effect (simple loop for Hero)
(function(){
  const typingArea = document.getElementById("typingArea");
  const words = ['Laukesh Kumar', 'Photo Editor', 'Content Creator', 'BGMI Player', 'Thumbnail Artist'];
  let i=0, j=0, dir=1;
  function tick(){
    const w = words[i];
    typingArea.textContent = w.slice(0,j);
    j += dir;
    if(j > w.length){ dir = -1; setTimeout(tick,1200); return; }
    if(j < 0){ dir = 1; i=(i+1)%words.length; j=0; }
    setTimeout(tick,70);
  }
  tick();
})();

// Back to top
const backTop = document.getElementById("backTop");
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 400) {
    backTop.style.display = 'grid';
  } else {
    backTop.style.display = 'none';
  }
});
backTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

// Contact form handling with elegant feedback
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const msg = document.getElementById('message').value.trim();
  
  const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
  const body = encodeURIComponent(`Hello Laukesh,\n\nI visited your portfolio and would like to connect!\n\nName: ${name}\nContact/WhatsApp: ${email}\nService Selected: ${service}\n\nProject Details:\n${msg}`);
  
  // Custom success visual feedback
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Opening WhatsApp/Email...</span> <i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    location.href = `mailto:aishukumari9508212254@gmail.com?subject=${subject}&body=${body}`;
    submitBtn.innerHTML = '<span>Opening Successful!</span> <i class="fas fa-check"></i>';
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
  }, 800);
});

// Lightbox: open image on portfolio card click with Before/After comparison
const lb = document.getElementById("lightbox");
const lbContent = document.getElementById("lightboxContent");
const lbClose = document.getElementById("lightboxClose");

document.querySelectorAll('.portfolio-card img').forEach(img => {
  img.addEventListener('click', () => {
    const beforeSrc = img.dataset.before;
    const afterSrc = img.src;
    
    // Inject comparison structure inside lightbox content
    lbContent.innerHTML = `
      <div class="lb-inner-wrapper" style="display:flex;gap:16px;align-items:center;flex-direction:column;padding:24px;position:relative;">
        <img id="lbMainImage" src="${afterSrc}" alt="Expanded portfolio edit" style="max-width:100%;max-height:65vh;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);object-fit:contain;transition:all 0.3s ease;"/>
        
        <div class="lb-meta" style="text-align:center;margin-top:8px;">
          <h3 style="margin:0 0 4px;font-size:18px;color:#fff;">${img.closest('.portfolio-card').querySelector('h3').textContent}</h3>
          <p style="margin:0;color:var(--muted);font-size:13px;">${img.closest('.portfolio-card').querySelector('.portfolio-meta').textContent}</p>
        </div>
        
        ${beforeSrc ? `
          <button id="lbToggleBA" class="btn btn-secondary" style="margin-top:8px;padding:8px 16px;font-size:13px;border-radius:20px;cursor:pointer;">
            <i class="fas fa-sliders-h"></i> <span>Show Before (Raw)</span>
          </button>
        ` : ''}
      </div>
    `;
    
    lb.style.display = 'flex';
    lb.setAttribute('aria-hidden', 'false');
    
    // Toggle logic for Before/After if dataset before exists
    if (beforeSrc) {
      const toggleBtn = document.getElementById('lbToggleBA');
      const mainImg = document.getElementById('lbMainImage');
      let isShowingBefore = false;
      
      toggleBtn.addEventListener('click', () => {
        if (isShowingBefore) {
          mainImg.src = afterSrc;
          toggleBtn.innerHTML = '<i class="fas fa-sliders-h"></i> <span>Show Before (Raw)</span>';
          toggleBtn.classList.remove('btn-primary');
          toggleBtn.classList.add('btn-secondary');
        } else {
          mainImg.src = beforeSrc;
          toggleBtn.innerHTML = '<i class="fas fa-sliders-h"></i> <span>Show After (Edited)</span>';
          toggleBtn.classList.remove('btn-secondary');
          toggleBtn.classList.add('btn-primary');
        }
        isShowingBefore = !isShowingBefore;
      });
    }
  });
});

// Close Lightbox handler
const closeLightbox = () => {
  lb.style.display = 'none';
  lb.setAttribute('aria-hidden', 'true');
  lbContent.innerHTML = '';
};

lbClose.addEventListener('click', closeLightbox);

// Close Lightbox when clicking outside the image container
lb.addEventListener('click', (e) => {
  if (e.target === lb) {
    closeLightbox();
  }
});

// Close Lightbox on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lb.style.display === 'flex') {
    closeLightbox();
  }
});

// Mobile Hamburger Menu toggle
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  burger.classList.toggle("open");
});

// Close menu when clicking nav link on mobile
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove("active");
    burger.classList.remove("open");
  });
});

// Portfolio Grid Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Toggle active state on buttons
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filterValue = btn.getAttribute('data-filter');
    
    portfolioCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');
      if (filterValue === 'all' || categories.includes(filterValue)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// Theme toggle (Dark / Light) with transition locks
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const body = document.body;
  
  // Add temporary locking class to avoid jarring animation glitches
  body.classList.add('theme-transitioning');
  
  if (body.getAttribute("data-theme") === "light") {
    body.removeAttribute("data-theme");
    localStorage.setItem('theme', 'dark');
  } else {
    body.setAttribute("data-theme", "light");
    localStorage.setItem('theme', 'light');
  }
  
  setTimeout(() => {
    body.classList.remove('theme-transitioning');
  }, 350);
});

// Load persistent theme settings
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.setAttribute("data-theme", "light");
  }
});
