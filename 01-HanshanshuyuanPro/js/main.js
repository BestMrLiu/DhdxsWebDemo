/* 寒山书院 — 交互脚本 */

(function () {
  'use strict';

  // ---------- 导航栏滚动效果 ----------
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const top = window.scrollY;
    if (top > 60) {
      nav.style.padding = '12px 0';
    } else {
      nav.style.padding = '24px 0';
    }
    lastScroll = top;
  }, { passive: true });

  // ---------- 移动端菜单 ----------
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

  // ---------- 当前页面高亮 ----------
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- 进场动画 ----------
  const animated = document.querySelectorAll('.fade-up, .fade-in');
  if ('IntersectionObserver' in window && animated.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), i * 80);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    animated.forEach(el => io.observe(el));
  } else {
    animated.forEach(el => el.classList.add('in'));
  }

  // ---------- 课程卡片 stagger ----------
  const courseCards = document.querySelectorAll('.course-card');
  if (courseCards.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          courseCards.forEach((c, i) => {
            setTimeout(() => c.classList.add('in'), i * 100);
          });
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    courseCards.forEach(c => co.observe(c));
  }

  // ---------- 作品筛选 ----------
  const filterBtns = document.querySelectorAll('.gallery-filter button');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      galleryItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
          requestAnimationFrame(() => item.style.opacity = '1');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---------- 报名表单 ----------
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

  // ---------- 平滑锚点 ----------
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

  // ---------- 师资卡片 stagger ----------
  const facultyCards = document.querySelectorAll('.faculty-card');
  if (facultyCards.length && 'IntersectionObserver' in window) {
    const fo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          facultyCards.forEach((c, i) => {
            setTimeout(() => c.classList.add('in'), i * 120);
          });
          fo.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    facultyCards.forEach(c => fo.observe(c));
  }

  // ---------- 数字滚动 ----------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1400;
          const start = performance.now();
          const animate = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (p < 1) requestAnimationFrame(animate);
            else el.textContent = target.toLocaleString();
          };
          requestAnimationFrame(animate);
          co.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }
})();


// 手风琴 FAQ - 一次只能展开一个
document.addEventListener('DOMContentLoaded', function(){
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    item.addEventListener('toggle', function(){
      if (item.open) {
        items.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
});
