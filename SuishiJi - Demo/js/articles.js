// articles.js
document.addEventListener('DOMContentLoaded', () => {
  // Category filter
  document.querySelectorAll('.filter-tag[data-filter]').forEach(tag => {
    tag.addEventListener('click', () => {
      const filter = tag.dataset.filter;
      // Update active state in this group
      tag.parentElement.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      // Filter cards
      document.querySelectorAll('.art-grid-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Sort filter
  document.querySelectorAll('.filter-tag[data-sort]').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.parentElement.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      showToast('按' + (tag.dataset.sort === 'latest' ? '最新' : '最热') + '排序');
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

  document.querySelectorAll('.art-grid-card, .art-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Pagination
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('page-btn-disabled')) return;
      document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('page-btn-active'));
      if (!btn.textContent.includes('←') && !btn.textContent.includes('→')) {
        btn.classList.add('page-btn-active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
