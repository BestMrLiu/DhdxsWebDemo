// gallery.js
let currentIndex = 0;
let galleryItems = [];

document.addEventListener('DOMContentLoaded', () => {
  // Gallery filter
  document.querySelectorAll('.gf-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      document.querySelectorAll('.gf-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.gm-item').forEach(item => {
        if (filter === 'all' || item.dataset.season === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Build gallery items list
  galleryItems = Array.from(document.querySelectorAll('.gm-item:not(.hidden)'));
});

function openGallery(el) {
  galleryItems = Array.from(document.querySelectorAll('.gm-item:not(.hidden)'));
  currentIndex = galleryItems.indexOf(el);
  showLightbox();
}

function showLightbox() {
  const item = galleryItems[currentIndex];
  const img = item.querySelector('.gm-img');
  const title = item.querySelector('.gm-title')?.textContent || '';
  const meta = item.querySelector('.gm-meta')?.textContent || '';

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxInfo = document.getElementById('lightboxInfo');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxInfo.innerHTML = title + ' <span style="opacity:0.6;font-size:0.8rem;">' + meta + '</span>';
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
  showLightbox();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (document.getElementById('lightbox').classList.contains('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});
