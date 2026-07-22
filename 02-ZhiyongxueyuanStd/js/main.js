/* 致用学院 — 交互脚本 */
(function () {
  'use strict';

  // Nav scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.04)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  // Active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });

  // Fade-in
  const animated = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && animated.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), i * 60);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animated.forEach(el => io.observe(el));
  } else {
    animated.forEach(el => el.classList.add('in'));
  }

  // Stagger course rows
  const courseRows = document.querySelectorAll('.course-row');
  if (courseRows.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          courseRows.forEach((c, i) => {
            setTimeout(() => c.classList.add('in'), i * 100);
          });
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    courseRows.forEach(c => co.observe(c));
  }

  // Faculty stagger
  const facultyCards = document.querySelectorAll('.faculty-card');
  if (facultyCards.length && 'IntersectionObserver' in window) {
    const fo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          facultyCards.forEach((c, i) => {
            setTimeout(() => c.classList.add('in'), i * 100);
          });
          fo.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    facultyCards.forEach(c => fo.observe(c));
  }

  // Method stagger
  const steps = document.querySelectorAll('.method-step');
  if (steps.length && 'IntersectionObserver' in window) {
    const mo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          steps.forEach((s, i) => {
            setTimeout(() => s.classList.add('in'), i * 100);
          });
          mo.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    steps.forEach(s => mo.observe(s));
  }

  // Form
  const form = document.getElementById('enrollForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = form.querySelector('.form-submit');
      submit.disabled = true;
      submit.innerHTML = '正在提交…';
      setTimeout(() => {
        form.reset();
        submit.disabled = false;
        submit.innerHTML = '提交报名 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
        if (success) success.classList.add('show');
        setTimeout(() => success && success.classList.remove('show'), 5000);
      }, 900);
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // Counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const duration = 1400;
          const start = performance.now();
          const animate = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = eased * target;
            el.textContent = val % 1 === 0 ? val.toLocaleString() : val.toFixed(1);
            if (p < 1) requestAnimationFrame(animate);
            else el.textContent = target % 1 === 0 ? target.toLocaleString() : target.toFixed(1);
          };
          requestAnimationFrame(animate);
          co.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }
})();
