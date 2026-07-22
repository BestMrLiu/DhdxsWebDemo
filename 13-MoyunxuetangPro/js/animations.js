/* ============================================
   墨韵学堂 · GSAP ScrollTrigger Animations
   ============================================ */

(function() {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Remove data-aos from elements GSAP will animate (prevent AOS conflict)
  document.querySelectorAll('.section-head[data-aos], .course-card[data-aos], .path-card[data-aos], .stat-item[data-aos], .gallery-preview-item[data-aos], .faculty-card[data-aos], .faq-item[data-aos], .contact-info-item[data-aos], .news-card[data-aos], [data-aos].swiper').forEach(el => {
    el.removeAttribute('data-aos');
    el.removeAttribute('data-aos-delay');
    el.style.opacity = '1'; // reset any AOS-set opacity
  });

  // ---------- Hero entrance ----------
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .fromTo('.hero-tag',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.hero-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-desc',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.hero-actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-scroll',
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.2'
    );

  // ---------- Section headers stagger ----------
  gsap.utils.toArray('.section-head').forEach(head => {
    const eyebrow = head.querySelector('.section-eyebrow');
    const h2 = head.querySelector('.section-h2');
    const desc = head.querySelector('.section-desc');
    const divider = head.querySelector('.divider-ink');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: head,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    if (h2) tl.fromTo(h2, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    if (divider) tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    if (desc) tl.fromTo(desc, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
  });

  // ---------- Course cards stagger ----------
  gsap.utils.toArray('.course-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Path cards ----------
  gsap.utils.toArray('.path-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.9,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Stats counter animation ----------
  gsap.utils.toArray('.counter').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);

    gsap.fromTo(counter,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function() {
          counter.textContent = Math.round(parseFloat(counter.textContent));
        },
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Stats items ----------
  gsap.utils.toArray('.stat-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Gallery preview items ----------
  gsap.utils.toArray('.gallery-preview-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Faculty cards ----------
  gsap.utils.toArray('.faculty-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Contact info items ----------
  gsap.utils.toArray('.contact-info-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Form entrance ----------
  const formEl = document.getElementById('contactForm');
  if (formEl) {
    gsap.fromTo(formEl,
      { opacity: 0, x: 30 },
      {
        opacity: 1, x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formEl,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ---------- FAQ items ----------
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---------- Parallax for hero ----------
  gsap.to('.hero-inner', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: -80,
    ease: 'none'
  });

  // ---------- Ink drop decorations ----------
  gsap.utils.toArray('.ink-drop').forEach(drop => {
    gsap.fromTo(drop,
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: drop,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

})();
