(function () {
  'use strict';

  const SELECTOR = '.pb-section[data-parallax-scroll="true"]';

  function isMobile() {
    return window.innerWidth <= 749;
  }

  function setHeight(sectionEl, speedRaw) {
    // Read image_height from data attribute set by liquid
    const size = sectionEl.dataset.imageHeight || 'fullscreen';

    if (isMobile()) {
      sectionEl.style.height = '';
      return;
    }

    const vh = window.innerHeight;

    // Base visible height (what the image shows at rest)
    const baseH = {
      small:      420,
      medium:     560,
      large:      720,
      fullscreen: vh
    }[size] || vh;

    // Travel distance: speed 1 = small travel, speed 10 = full viewport worth of travel
    // Maps speed 1–10 to 0.1×vh – 1.0×vh of extra section height
    const extraH = vh * (speedRaw / 10);

    sectionEl.style.height = Math.round(baseH + extraH) + 'px';
  }

  function init(rootEl) {
    const sections = Array.from(rootEl.querySelectorAll(SELECTOR));
    if (!sections.length) return;

    sections.forEach((sectionEl) => {
      const speedRaw = parseInt(sectionEl.dataset.scrollSpeed, 10) || 5;

      setHeight(sectionEl, speedRaw);

      window.addEventListener('resize', throttle(() => setHeight(sectionEl, speedRaw), 200));
    });
  }

  window.addEventListener('DOMContentLoaded', () => init(document));

  if (Shopify.designMode) {
    document.addEventListener('shopify:section:load', (e) => init(e.target));
    document.addEventListener('shopify:section:reorder', () => init(document));
  }
})();
