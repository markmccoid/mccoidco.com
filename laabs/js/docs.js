/**
 * LAABS Audio — Docs page JS
 * Sidebar active link tracking: the active section is the last one
 * whose top has scrolled past a line just below the sticky header.
 */

'use strict';

const sidebarLinks = document.querySelectorAll('[data-sidebar-link]');
const docsSections = [...document.querySelectorAll('.docs-section')];

if (sidebarLinks.length > 0 && docsSections.length > 0) {
  const OFFSET = 140;

  const update = () => {
    let current = docsSections[0];
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    if (atBottom) {
      current = docsSections[docsSections.length - 1];
    } else {
      for (const section of docsSections) {
        if (section.getBoundingClientRect().top - OFFSET <= 0) current = section;
      }
    }

    const id = current.id;
    sidebarLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  update();
}
