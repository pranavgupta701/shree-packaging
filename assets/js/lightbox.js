/**
 * Shree Packaging — Interactive Image Lightbox & Zoom Viewer
 * Supports desktop click, keyboard navigation (Escape, Left, Right),
 * mobile swipe gestures, and full-resolution view.
 */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImageLightbox);
} else {
  initImageLightbox();
}

function initImageLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  if (galleryItems.length === 0) return;

  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Image Zoom Viewer');
    modal.innerHTML = `
      <div class="lightbox-modal__backdrop"></div>
      <button class="lightbox-modal__close" aria-label="Close image zoom view">&times;</button>
      <button class="lightbox-modal__nav lightbox-modal__prev" aria-label="Previous photo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="lightbox-modal__nav lightbox-modal__next" aria-label="Next photo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
      <div class="lightbox-modal__content">
        <div class="lightbox-modal__stage">
          <img src="" alt="" class="lightbox-modal__img">
        </div>
        <div class="lightbox-modal__footer">
          <div class="lightbox-modal__caption"></div>
          <div class="lightbox-modal__counter"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = modal.querySelector('.lightbox-modal__img');
  const captionEl = modal.querySelector('.lightbox-modal__caption');
  const counterEl = modal.querySelector('.lightbox-modal__counter');
  const closeBtn = modal.querySelector('.lightbox-modal__close');
  const prevBtn = modal.querySelector('.lightbox-modal__prev');
  const nextBtn = modal.querySelector('.lightbox-modal__next');
  const backdrop = modal.querySelector('.lightbox-modal__backdrop');

  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    if (!img) return;

    modalImg.src = img.src;
    modalImg.alt = img.alt || 'Production Facility Photo';
    captionEl.textContent = img.alt || 'Shree Packaging Manufacturing Facility';
    counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  }

  function openLightbox(index) {
    showImage(index);
    modal.classList.add('active');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, index) => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('title', 'Click to zoom photo');

    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  let touchStartX = 0;
  let touchStartY = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        showImage(currentIndex + 1);
      } else {
        showImage(currentIndex - 1);
      }
    } else if (diffY < -80) {
      closeLightbox();
    }
  }, { passive: true });
}
