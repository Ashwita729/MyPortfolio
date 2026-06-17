const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function initThemeToggle() {
  const btn = $('#themeToggle');
  if (!btn) return;

  setTheme(getPreferredTheme());

  btn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
    btn.blur();
  });
}

function initMobileNav() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');
  if (!hamburger || !mobileNav) return;

  const links = $$('a', mobileNav);

  const setOpen = (open) => {
    hamburger.setAttribute('aria-expanded', String(open));
    mobileNav.style.display = open ? 'flex' : '';
  };

  // default closed
  setOpen(false);

  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));

  // close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setOpen(false);
  });
}

function initScrollReveal() {
  const els = $$('[data-reveal]');
  if (!els.length) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('is-in');
      });
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));
}

function initProjectModals() {
  const cards = $$('.project-card');
  if (!cards.length) return;

  const openModalFor = (card) => {
    const modal = $('.project-modal', card);
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');

    const closeBtn = $('.project-modal__close', modal);
    const close = () => {
      modal.setAttribute('aria-hidden', 'true');
      closeBtn?.blur();
    };

    closeBtn?.addEventListener('click', close, { once: true });
    const closeers = $$('[data-close-modal]', modal);
    closeers.forEach((b) => b.addEventListener('click', close, { once: true }));

    // click outside panel
    modal.addEventListener(
      'click',
      (ev) => {
        if (ev.target === modal) close();
      },
      { once: true }
    );
  };

  const closeAll = () => {
    $$('.project-modal').forEach((m) => m.setAttribute('aria-hidden', 'true'));
  };

  cards.forEach((card) => {
    const openBtn = $('.project-card__more', card);

    const open = () => {
      closeAll();
      openModalFor(card);
    };

    openBtn?.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

function initResumeButton() {
  const btn = $('#downloadResumeBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    showToast('Resume download is a placeholder in this offline version. Add resume.pdf to enable downloads.');
  });
}

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Form submit is placeholder (static site). Wire to EmailJS/backend to enable messages.');
  });
}

function initAll() {
  initThemeToggle();
  initMobileNav();
  initScrollReveal();
  initProjectModals();
  initResumeButton();
  initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

