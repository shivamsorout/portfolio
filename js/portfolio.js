const typedText = document.getElementById('typed-text');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const revealElements = document.querySelectorAll('.reveal');
const currentYear = document.getElementById('current-year');

const roles = ['Java Developer', 'Spring AI Engineer', 'Enterprise Backend Specialist', 'Payment Integration Expert'];
let roleIndex = 0;
let charIndex = 0;
let reverse = false;

function updateTypedText() {
  if (!typedText) return;
  const current = roles[roleIndex];
  if (!reverse) {
    typedText.textContent = current.slice(0, charIndex + 1);
    charIndex += 1;
    if (charIndex === current.length) {
      reverse = true;
      setTimeout(updateTypedText, 1000);
      return;
    }
  } else {
    typedText.textContent = current.slice(0, charIndex - 1);
    charIndex -= 1;
    if (charIndex === 0) {
      reverse = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(updateTypedText, reverse ? 50 : 80);
}

function updateYear() {
  if (currentYear) currentYear.textContent = new Date().getFullYear();
}

function revealOnScroll() {
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.14 }
  );
  revealElements.forEach((el) => observer.observe(el));
}

function handleNavToggle() {
  if (!navToggle || !navLinks) return;

  const navContainer = document.querySelector('.nav-container');

  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  // Move nav-links out of sticky topbar on mobile so position:fixed works correctly.
  // position:sticky creates a containing block for fixed descendants in Chrome/Safari,
  // trapping the overlay inside the 64px topbar. Moving to body puts it in root context.
  function relocateNav() {
    if (window.innerWidth <= 768) {
      if (navLinks.parentElement !== document.body) {
        closeNav();
        document.body.appendChild(navLinks);
      }
    } else {
      if (navLinks.parentElement !== navContainer) {
        closeNav();
        navContainer.appendChild(navLinks);
      }
    }
  }

  relocateNav();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(relocateNav, 100);
  });

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
}

// ── Skills Category Carousel ────────────────────────────────────────────────
function initSkillsCarousel() {
  const track = document.getElementById('skillsTrack');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsEl = document.getElementById('carouselDots');
  const catNameEl = document.getElementById('categoryName');
  const catCountEl = document.getElementById('categoryCount');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.skill-category-slide'));
  const TOTAL = slides.length;
  const NAMES = [
    'Backend Technologies',
    'Frontend Technologies',
    'Databases',
    'Cloud & Integrations',
    'Development Tools',
    'Core Skills',
    'Enterprise Tools',
  ];

  let idx = 0;
  let timer = null;

  function update() {
    track.style.transform = `translateX(${-idx * 100}%)`;
    if (catNameEl) catNameEl.textContent = NAMES[idx] || '';
    if (catCountEl) catCountEl.textContent = `${idx + 1} / ${TOTAL}`;
    renderDots();
  }

  function renderDots() {
    if (!dotsEl) return;
    if (dotsEl.children.length !== TOTAL) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < TOTAL; i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot';
        d.setAttribute('aria-label', NAMES[i] || `Slide ${i + 1}`);
        d.addEventListener('click', () => { goTo(i); startAuto(); });
        dotsEl.appendChild(d);
      }
    }
    Array.from(dotsEl.children).forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function goTo(i) {
    idx = ((i % TOTAL) + TOTAL) % TOTAL;
    update();
  }

  function goNext() { goTo(idx + 1); }
  function goPrev() { goTo(idx - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(goNext, 3500);
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  prevBtn.addEventListener('click', () => { goPrev(); startAuto(); });
  nextBtn.addEventListener('click', () => { goNext(); startAuto(); });

  const wrap = document.querySelector('.skills-carousel-container');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
  }

  update();

  const skillsSection = document.getElementById('skills');
  if ('IntersectionObserver' in window && skillsSection) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startAuto();
      } else {
        stopAuto();
        goTo(0);
      }
    }, { threshold: 0.15 });
    io.observe(skillsSection);
  } else {
    startAuto();
  }
}

// ── Modal System ─────────────────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close')?.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function initModals() {
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach((m) => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
function init() {
  updateYear();
  updateTypedText();
  revealOnScroll();
  handleNavToggle();
  initSkillsCarousel();
  initModals();
}

window.addEventListener('DOMContentLoaded', init);
