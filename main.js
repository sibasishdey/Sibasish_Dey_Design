 // Animated category filtering
    const filters = document.querySelectorAll('.filter');
    const cards = document.querySelectorAll('.work-card');
    const count = document.getElementById('work-count');
    const FILTER_OUT_MS = 220;

    filters.forEach((button) => {
      button.addEventListener('click', () => {
        const category = button.dataset.filter;
        filters.forEach((item) => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });

        let visible = 0;
        cards.forEach((card) => {
          window.clearTimeout(card.filterTimer);
          const show = category === 'all' || card.dataset.category === category;

          if (show) {
            card.hidden = false;
            card.classList.remove('filter-out', 'filter-in');
            // Restart the entrance animation when switching tabs.
            void card.offsetWidth;
            card.classList.add('filter-in');
            card.filterTimer = window.setTimeout(() => card.classList.remove('filter-in'), 420);
            visible++;
          } else if (!card.hidden) {
            card.classList.remove('filter-in');
            card.classList.add('filter-out');
            card.filterTimer = window.setTimeout(() => {
              if (card.classList.contains('filter-out')) {
                card.hidden = true;
                card.classList.remove('filter-out');
              }
            }, FILTER_OUT_MS);
          }
        });
        count.textContent = `${visible} ${visible === 1 ? 'selected piece' : 'selected pieces'}`;
      });
    });

    // Accessible image preview modal for gallery artwork and featured images.
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    let lastImageTrigger = null;

    function openLightbox(src, altText, caption, trigger) {
      if (!src) return;
      lastImageTrigger = trigger || document.activeElement;
      lightboxImage.src = src;
      lightboxImage.alt = altText || 'Expanded portfolio artwork';
      lightboxCaption.textContent = caption || altText || 'Portfolio artwork';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      lightboxClose.focus();
    }

    function closeLightbox() {
      if (!lightbox.classList.contains('is-open')) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      lightboxImage.removeAttribute('src');
      if (lastImageTrigger && typeof lastImageTrigger.focus === 'function') lastImageTrigger.focus();
    }

    document.addEventListener('click', (event) => {
      const artworkLink = event.target.closest('.work-image-link, .view-art');
      if (artworkLink) {
        event.preventDefault();
        const card = artworkLink.closest('.work-card');
        const image = card ? card.querySelector('img') : null;
        const title = card?.querySelector('h3')?.textContent?.trim() || '';
        const src = artworkLink.getAttribute('href') || image?.currentSrc || image?.src;
        openLightbox(src, image?.alt || title, title, artworkLink);
        return;
      }

      const featuredImage = event.target.closest('.hero-art img');
      if (featuredImage) {
        openLightbox(featuredImage.currentSrc || featuredImage.src, featuredImage.alt, featuredImage.alt, featuredImage);
        return;
      }

      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      const featuredImage = event.target.closest?.('.hero-art img');
      if (featuredImage && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openLightbox(featuredImage.currentSrc || featuredImage.src, featuredImage.alt, featuredImage.alt, featuredImage);
      }
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'Tab' && lightbox.classList.contains('is-open')) {
        event.preventDefault();
        lightboxClose.focus();
      }
    });

    lightboxClose.addEventListener('click', closeLightbox);

    // Make the two featured hero images keyboard-accessible as modal triggers.
    document.querySelectorAll('.hero-art img').forEach((image) => {
      image.setAttribute('tabindex', '0');
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `View larger image: ${image.alt || 'Featured artwork'}`);
    });

    document.getElementById('year').textContent = new Date().getFullYear();