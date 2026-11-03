// ========== Service Worker Registration ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered!'))
      .catch(err => console.log('Service Worker error:', err));
  });
}

// ========== Service Worker Code (save as sw.js) ==========
/*
const CACHE_NAME = 'laukesh-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/laukesh.jpeg',
  '/portfolio.png',
  '/portfolio-after.jpeg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
*/

// ========== Lazy Loading Images ==========
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.observer = new IntersectionObserver(
      (entries) => this.onIntersection(entries),
      { rootMargin: '100px' }
    );
    
    this.images.forEach(img => this.observer.observe(img));
  }
  
  onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        this.observer.unobserve(img);
        
        img.onload = () => {
          img.style.opacity = '1';
          img.style.filter = 'blur(0)';
        };
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => new LazyLoader());

// ========== Debounce Function for Performance ==========
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== Resource Hints ==========
function addResourceHints() {
  const hints = [
    { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    { rel: 'preload', href: '/laukesh.jpeg', as: 'image' }
  ];
  
  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.keys(hint).forEach(key => link.setAttribute(key, hint[key]));
    document.head.appendChild(link);
  });
}

window.addEventListener('DOMContentLoaded', addResourceHints);

// ========== Request Idle Callback for Non-Critical Tasks ==========
function runWhenIdle(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

// Example: Load analytics only when idle
runWhenIdle(() => {
  console.log('Non-critical performance tracking scripts initialized in idle state');
});

// ========== Font Loading Strategy ==========
if ('fonts' in document) {
  Promise.all([
    document.fonts.load('400 1em Poppins'),
    document.fonts.load('600 1em Poppins'),
    document.fonts.load('700 1em Poppins')
  ]).then(() => {
    document.body.classList.add('fonts-loaded');
  });
}

// ========== Memory Management ==========
class MemoryManager {
  constructor() {
    this.observers = [];
    this.timers = [];
    this.listeners = [];
  }
  
  addObserver(observer) {
    this.observers.push(observer);
    return observer;
  }
  
  addTimer(timer) {
    this.timers.push(timer);
    return timer;
  }
  
  addListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }
  
  cleanup() {
    this.observers.forEach(obs => obs.disconnect());
    this.timers.forEach(timer => clearTimeout(timer));
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    
    this.observers = [];
    this.timers = [];
    this.listeners = [];
  }
}

const memoryManager = new MemoryManager();

// ========== Network Information API ==========
function adaptToNetworkSpeed() {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    if (connection.effectiveType === '4g') {
      document.body.classList.add('high-quality-network');
    } else {
      document.body.classList.add('low-quality-network');
    }
    
    connection.addEventListener('change', () => {
      console.log('Network type changed:', connection.effectiveType);
    });
  }
}

window.addEventListener('DOMContentLoaded', adaptToNetworkSpeed);

// ========== Intersection Observer for Scroll Animations ==========
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animationObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animationObserver.observe(el);
  });
});