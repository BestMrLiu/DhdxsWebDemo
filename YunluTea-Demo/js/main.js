/**
 * 云露茶事 · Yunlu Tea — Brand Landing Page
 * Demo 1: 云鼎素茶品牌官网
 * Scroll animations & interactions
 */

(function () {
  'use strict';

  // ---------- Scroll Reveal ----------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // ---------- Nav Scroll State ----------
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  function updateNav() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', updateNav, { passive: true });

  // ---------- Smooth Scroll for Nav Links ----------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Contact Form ----------
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      success.classList.add('show');
      form.reset();
      setTimeout(() => {
        success.classList.remove('show');
      }, 4000);
    });
  }

  // ---------- Mobile Menu Toggle ----------
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const isActive = mobileMenu.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-label', isActive ? '关闭菜单' : '打开菜单');
      document.body.style.overflow = isActive ? 'hidden' : '';
      if (isActive) {
        nav.classList.add('scrolled');
      } else if (window.pageYOffset <= 40) {
        nav.classList.remove('scrolled');
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-label', '打开菜单');
        document.body.style.overflow = '';
        if (window.pageYOffset <= 40) {
          nav.classList.remove('scrolled');
        }
      });
    });
  }
})();
