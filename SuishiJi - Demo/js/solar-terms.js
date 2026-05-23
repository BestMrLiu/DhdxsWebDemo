// solar-terms.js

document.addEventListener('DOMContentLoaded', () => {
  // Season filter tabs
  document.querySelectorAll('.sf-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const season = tab.dataset.season;
      document.querySelectorAll('.sf-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.season-group').forEach(group => {
        if (season === 'all') {
          group.style.display = '';
        } else {
          group.style.display = group.dataset.season === season ? '' : 'none';
        }
      });

      // Scroll to first visible group
      const firstVisible = document.querySelector('.season-group:not([style*="none"])');
      if (firstVisible) {
        firstVisible.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.term-detail-card, .season-group-header, .intro-card, .pentad-ref-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
