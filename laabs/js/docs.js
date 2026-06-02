/**
 * LAABS Audio — Docs page JS
 * Sidebar active link tracking via IntersectionObserver
 */

'use strict';

/* ── Docs sidebar active state ── */
const sidebarLinks = document.querySelectorAll('[data-sidebar-link]');
const docsSections = document.querySelectorAll('.docs-section');

if (sidebarLinks.length > 0 && docsSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          sidebarLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('is-active');
            }
          });
        }
      });
    },
    {
      // When section is 30% visible, mark it active
      threshold: 0.2,
      rootMargin: '-80px 0px -50% 0px'
    }
  );

  docsSections.forEach(section => sectionObserver.observe(section));
}
