// Typing effect (simple loop)
(function(){
  const typingArea = document.getElementById("typingArea"); // ✅ added
  const words = ['Photo Editor','Content Creator','BGMI Player','Thumbnail Artist'];
  let i=0,j=0,dir=1;
  function tick(){
    const w = words[i];
    typingArea.textContent = w.slice(0,j);
    j += dir;
    if(j > w.length){ dir = -1; setTimeout(tick,700); return; }
    if(j < 0){ dir = 1; i=(i+1)%words.length; j=0; }
    setTimeout(tick,80);
  }
  tick();
})();

// Back to top
const backTop = document.getElementById("backTop"); // ✅ added
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 400) backTop.style.display='grid'; 
  else backTop.style.display='none';
});
backTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

// Contact form: try mailto fallback
document.getElementById('contactForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Work inquiry from '+name);
  const body = encodeURIComponent(`Name: ${name}\nContact: ${email}\n\nMessage:\n${msg}`);
  location.href = `mailto:ankitai@example.com?subject=${subject}&body=${body}`;
});

// Lightbox: open image on card click show before/after button
const lb = document.getElementById("lightbox");   // ✅ added
const lbInner = document.getElementById("lbInner"); // ✅ added
document.querySelectorAll('.card img').forEach(img=>{
  img.addEventListener('click', ()=>{
    const before = img.dataset.before;
    const afterSrc = img.src;
    lbInner.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;flex-direction:column">
        <img src="${afterSrc}" alt="after" style="max-height:70vh"/>
        ${before ? `<button id="toggleBA" class="btn ghost" style="margin-top:8px">Show Before</button>` : ''}
      </div>
    `;
    lb.style.display = 'flex';
    lb.setAttribute('aria-hidden','false');
    if(before){
      const btn = document.getElementById('toggleBA');
      let showingBefore = false;
      btn.addEventListener('click', ()=>{
        const imgEl = lbInner.querySelector('img');
        imgEl.src = showingBefore ? afterSrc : before;
        btn.textContent = showingBefore ? 'Show Before' : 'Show After';
        showingBefore = !showingBefore;
      });
    }
  });
});

// Hamburger menu toggle
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  burger.classList.toggle("open");
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const body = document.body;
  if (body.getAttribute("data-theme") === "light") {
    body.removeAttribute("data-theme");
  } else {
    body.setAttribute("data-theme", "light");
  }
});
