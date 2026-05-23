// wisdom.js
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  document.querySelectorAll('.wisdom-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      document.querySelectorAll('.wisdom-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.wisdom-content-section').forEach(section => {
        section.classList.add('hidden');
      });
      document.getElementById('tab-' + tabName)?.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  document.querySelectorAll('.current-wisdom-card, .exercise-card, .living-card, .ritual-card, .mood-card, .wisdom-season-block, .food-calendar').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
