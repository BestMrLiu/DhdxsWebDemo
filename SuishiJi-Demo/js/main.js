// 岁时记 - Main JavaScript

// Nav scroll
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Season/tab switching
document.querySelectorAll('.season-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const season = tab.dataset.season;
    document.querySelectorAll('.season-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.season-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('panel-' + season)?.classList.remove('hidden');
  });
});

// Article tab switching
document.querySelectorAll('.article-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    document.querySelectorAll('.article-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.article-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(target)?.classList.remove('hidden');
  });
});

// Scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('[data-scroll]').forEach(el => scrollObserver.observe(el));

// Counter animation
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  });
}

// IntersectionObserver for counter
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const counterEl = document.querySelector('[data-count]');
if (counterEl) counterObserver.observe(counterEl.parentElement);

// Toast
function showToast(msg, duration = 2500) {
  const old = document.querySelector('.suishi-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'suishi-toast';
  el.style.cssText = `
    position:fixed;bottom:40px;left:50%;transform:translateX(-50%);
    background:var(--ink);color:var(--cream);
    padding:12px 28px;border-radius:4px;
    font-family:var(--font-body);font-weight:500;font-size:0.88rem;
    z-index:99999;letter-spacing:0.05em;
    box-shadow:0 8px 30px rgba(26,26,46,0.2);
    opacity:0;transition:all 0.3s ease;
    white-space:nowrap;
  `;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; });
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// Filter click
document.querySelectorAll('.filter-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
  });
});

// Book toggle
document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('click', () => {
    showToast('书籍详情页开发中...');
  });
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.classList.add('animate-in');
  });
});
