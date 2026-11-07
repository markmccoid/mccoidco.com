/**
 * LAABS Audio — Main JS
 * Loads shared header/footer partials, adapts links based on page,
 * and initializes navigation scroll behavior, mobile menu, and scroll reveal.
 */

'use strict';

// Initialize everything after header and footer are loaded
async function init() {
  await loadPartials();
  initNavigation();
  initScrollReveal();
  initSmoothScroll();
  initHeroCarousel();
}

// Asynchronously load header and footer
async function loadPartials() {
  const headerContainer = document.getElementById('site-header');
  const footerContainer = document.getElementById('site-footer');

  // Load Header
  if (headerContainer) {
    try {
      const response = await fetch('header.html');
      if (response.ok) {
        headerContainer.innerHTML = await response.text();
        adaptHeaderLinks();
      } else {
        console.error('Failed to load header:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading header:', error);
    }
  }

  // Load Footer
  if (footerContainer) {
    try {
      const response = await fetch('footer.html');
      if (response.ok) {
        footerContainer.innerHTML = await response.text();
        adaptFooterLinks();
      } else {
        console.error('Failed to load footer:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  }
}

// Adapt header links based on which page we are on
function adaptHeaderLinks() {
  const isDocsPage = window.location.pathname.includes('docs.html');
  const isPrivacyPage = window.location.pathname.includes('privacy.html');
  const navElement = document.getElementById('nav');

  if (isDocsPage || isPrivacyPage) {
    // We are on Docs or Privacy: navigation starts pre-scrolled/styled light
    if (navElement) {
      navElement.classList.add('is-scrolled');
    }
    
    if (isDocsPage) {
      // Set active link for Documentation
      const docLink = document.getElementById('nav-link-docs');
      const mobileDocLink = document.getElementById('mobile-link-docs');
      
      if (docLink) {
        docLink.setAttribute('aria-current', 'page');
        docLink.style.color = 'var(--text-primary)';
      }
      if (mobileDocLink) {
        mobileDocLink.setAttribute('aria-current', 'page');
      }
    }

    // Change nav download button id/text if desired, or keep as is
    const downloadBtn = document.getElementById('nav-appstore-btn');
    if (downloadBtn) {
      downloadBtn.id = 'nav-docs-appstore-btn';
    }
  } else {
    // We are on Index (landing page): change header links to direct hashes for smooth scroll
    const featuresLink = document.getElementById('nav-link-features');
    const screenshotsLink = document.getElementById('nav-link-screenshots');
    const mobileFeaturesLink = document.getElementById('mobile-link-features');
    const mobileScreenshotsLink = document.getElementById('mobile-link-screenshots');

    if (featuresLink) featuresLink.setAttribute('href', '#features');
    if (screenshotsLink) screenshotsLink.setAttribute('href', '#screenshots');
    if (mobileFeaturesLink) mobileFeaturesLink.setAttribute('href', '#features');
    if (mobileScreenshotsLink) mobileScreenshotsLink.setAttribute('href', '#screenshots');
  }
}

// Adapt footer links based on page
function adaptFooterLinks() {
  const isDocsPage = window.location.pathname.includes('docs.html');
  const isPrivacyPage = window.location.pathname.includes('privacy.html');

  if (isDocsPage) {
    // We are on Docs: change internal docs section footer links to absolute hashes
    const startLink = document.getElementById('footer-link-start');
    const connectLink = document.getElementById('footer-link-connect');
    const troubleshootLink = document.getElementById('footer-link-troubleshoot');

    if (startLink) startLink.setAttribute('href', '#getting-started');
    if (connectLink) connectLink.setAttribute('href', '#connecting');
    if (troubleshootLink) troubleshootLink.setAttribute('href', '#troubleshooting');
  } else if (!isPrivacyPage) {
    // We are on Index: change product links to direct hashes
    const featuresLink = document.getElementById('footer-link-features');
    const screenshotsLink = document.getElementById('footer-link-screenshots');

    if (featuresLink) featuresLink.setAttribute('href', '#features');
    if (screenshotsLink) screenshotsLink.setAttribute('href', '#screenshots');
  }
}

/* ── Navigation scroll state & Mobile menu ── */
function initNavigation() {
  const navElement = document.getElementById('nav');
  const isDocsPage = window.location.pathname.includes('docs.html');
  const isPrivacyPage = window.location.pathname.includes('privacy.html');

  function updateNavState() {
    // Docs or Privacy page nav is always scrolled (light background)
    if (isDocsPage || isPrivacyPage) {
      navElement.classList.add('is-scrolled');
      return;
    }
    if (window.scrollY > 20) {
      navElement.classList.add('is-scrolled');
    } else {
      navElement.classList.remove('is-scrolled');
    }
  }

  if (navElement) {
    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
  }

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('is-open');

      hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileMenu.querySelectorAll('[data-mobile-link]').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ── Intersection Observer — scroll reveal ── */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve after reveal to save performance
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }
}

/* ── Smooth scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // Placeholder links

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── Hero screen carousel ── */
function initHeroCarousel() {
  const root = document.getElementById('hero-carousel');
  if (!root) return;

  const slides = [...root.querySelectorAll('.hero-slide')];
  const dots = [...root.querySelectorAll('.hero-carousel__dot')];
  const caption = root.querySelector('[data-carousel-caption]');
  const count = root.querySelector('[data-carousel-count]');
  const prevImg = root.querySelector('[data-carousel-prev] img');
  const nextImg = root.querySelector('[data-carousel-next] img');
  if (slides.length < 2) return;

  let index = 0;
  const wrap = (i) => (i + slides.length) % slides.length;

  function show(i) {
    index = wrap(i);
    slides.forEach((img, n) => {
      const active = n === index;
      img.classList.toggle('is-active', active);
      img.setAttribute('aria-hidden', String(!active));
      if (active) img.loading = 'eager';
    });
    dots.forEach((dot, n) => {
      dot.classList.toggle('is-active', n === index);
      dot.setAttribute('aria-current', n === index ? 'true' : 'false');
    });
    caption.textContent = slides[index].dataset.caption;
    count.textContent = `${index + 1} / ${slides.length}`;
    if (prevImg) prevImg.src = slides[wrap(index - 1)].getAttribute('src');
    if (nextImg) nextImg.src = slides[wrap(index + 1)].getAttribute('src');
  }

  root.querySelectorAll('[data-carousel-step]').forEach((btn) => {
    btn.addEventListener('click', () => show(index + Number(btn.dataset.carouselStep)));
  });
  dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.index))));
  root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => show(index - 1));
  root.querySelector('[data-carousel-next]')?.addEventListener('click', () => show(index + 1));

  // Arrow keys: when focus is inside the carousel, or anywhere while the hero is on screen
  let heroVisible = true;
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; }, { threshold: 0.3 })
    .observe(root);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (!heroVisible && !root.contains(document.activeElement)) return;
    e.preventDefault();
    show(index + (e.key === 'ArrowRight' ? 1 : -1));
  });

  // Swipe on touch screens
  let startX = null;
  const stack = root.querySelector('.hero__phone-stack');
  stack.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  stack.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  show(0);
}

// Start execution
document.addEventListener('DOMContentLoaded', init);
