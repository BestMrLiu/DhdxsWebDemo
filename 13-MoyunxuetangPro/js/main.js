/* ============================================
   墨韵学堂 · Main JavaScript
   Navigation, Swiper, AOS, UI Interactions
   ============================================ */

(function() {
  'use strict';

  // ---------- AOS Init ----------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: window.innerWidth < 768
    });
  }

  // ---------- Navigation ----------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Scroll effect
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  });

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // ---------- Swiper: Faculty ----------
  if (typeof Swiper !== 'undefined') {
    const facultySwiper = document.querySelector('.facultySwiper');
    if (facultySwiper) {
      new Swiper('.facultySwiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        pagination: {
          el: '.facultySwiper .swiper-pagination',
          clickable: true,
          dynamicBullets: true
        },
        breakpoints: {
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        },
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false
        }
      });
    }

    // ---------- Swiper: Testimonials ----------
    const testimonialSwiper = document.querySelector('.testimonialSwiper');
    if (testimonialSwiper) {
      new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 32,
        loop: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        pagination: {
          el: '.testimonialSwiper .swiper-pagination',
          clickable: true
        },
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        }
      });
    }
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Form submission ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        提交中...
      `;
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          预约成功，我们会尽快联系您
        `;
        btn.style.background = 'var(--celadon)';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ---------- Gallery filter (for gallery page) ----------
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
          });
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    });
  });

  // ---------- Course tab switch (for courses page) ----------
  const courseTabs = document.querySelectorAll('.course-tab');
  const coursePanels = document.querySelectorAll('.course-panel');

  courseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      courseTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      coursePanels.forEach(panel => {
        if (panel.id === target) {
          panel.style.display = '';
          panel.style.opacity = '0';
          requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.4s ease';
            panel.style.opacity = '1';
          });
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // ---------- Course filter (courses page) ----------
  const courseFilterContainer = document.getElementById('courseFilter');
  if (courseFilterContainer) {
    const courseSections = document.querySelectorAll('.course-section');
    courseFilterContainer.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        courseFilterContainer.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        courseSections.forEach(sec => {
          const audiences = sec.getAttribute('data-audience') || '';
          if (filter === 'all' || audiences.includes(filter)) {
            sec.style.display = '';
            sec.style.opacity = '0';
            requestAnimationFrame(() => { sec.style.transition = 'opacity 0.4s ease'; sec.style.opacity = '1'; });
          } else {
            sec.style.opacity = '0';
            setTimeout(() => { sec.style.display = 'none'; }, 400);
          }

          // Show/hide audience blocks within each visible section
          sec.querySelectorAll('.course-audience-block').forEach(block => {
            const blockAudience = block.getAttribute('data-audience') || '';
            if (filter === 'all' || blockAudience === filter || blockAudience.includes(filter)) {
              block.style.display = '';
            } else {
              block.style.display = 'none';
            }
          });
        });

        // Overview table rows
        document.querySelectorAll('.course-overview-row').forEach(row => {
          const a = row.getAttribute('data-audience') || '';
          if (filter === 'all' || a.includes(filter)) { row.style.display = ''; } else { row.style.display = 'none'; }
        });
      });
    });
  }

  // ---------- Add spin animation for form button ----------
  const style = document.createElement('style');
  style.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
  document.head.appendChild(style);

})();
