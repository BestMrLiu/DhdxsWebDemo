// poetry.js
document.addEventListener('DOMContentLoaded', () => {
  // Season filter
  document.querySelectorAll('.poetry-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      document.querySelectorAll('.poetry-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.poem-card').forEach(card => {
        if (filter === 'all' || card.dataset.season === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Scroll animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.poem-card, .poem-featured-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
