// ── Custom cursor ─────────────────────────────────────────────
const dot = document.getElementById('cursor-dot');

document.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, .fun-item, .project-card, .aside-card, .skill-group, .stag').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── Floating petals ───────────────────────────────────────────
const petalContainer = document.getElementById('petals');
const PETAL_COUNT = 18;

const petalColors = [
  'rgba(196,131,122,.5)',
  'rgba(232,168,159,.45)',
  'rgba(212,184,150,.4)',
  'rgba(196,131,122,.35)',
  'rgba(122,158,142,.3)',
];

for (let i = 0; i < PETAL_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  const size   = 8 + Math.random() * 14;
  const left   = Math.random() * 100;
  const dur    = 9 + Math.random() * 14;
  const delay  = -Math.random() * dur;
  const color  = petalColors[Math.floor(Math.random() * petalColors.length)];
  p.style.cssText = `
    width:${size}px; height:${size * 1.4}px;
    left:${left}%;
    background:${color};
    animation-duration:${dur}s;
    animation-delay:${delay}s;
    border-radius: 50% 0 50% 0;
  `;
  petalContainer.appendChild(p);
}

// ── Mobile menu ───────────────────────────────────────────────
const menuBtn    = document.querySelector('.menu-btn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mobileMenu?.addEventListener('click', e => {
  if (e.target.tagName === 'A') { mobileMenu.classList.remove('open'); menuBtn.classList.remove('open'); }
});

// ── Header scroll shadow ──────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Progress dots ─────────────────────────────────────────────
const sections = [...document.querySelectorAll('main > section')];
const dotsC    = document.getElementById('progressDots');
sections.forEach(s => {
  const d = document.createElement('a');
  d.href = `#${s.id}`; d.className = 'dot'; d.title = s.id;
  dotsC.appendChild(d);
});

const navLinks = [...document.querySelectorAll('#site-header nav a')];
const mobLinks = [...document.querySelectorAll('#mobileMenu a')];
const dots     = [...document.querySelectorAll('.dot')];
const toTop    = document.getElementById('toTop');

function setActive(id) {
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  mobLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  dots.forEach((d, i) => d.classList.toggle('active', sections[i]?.id === id));
  toTop.classList.toggle('show', id !== 'home');
}

// ── Intersection observers ────────────────────────────────────
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
  { threshold: 0.45 }
);
sections.forEach(s => io.observe(s));

const revealIO = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealIO.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

// ── 3D Tilt on project cards ──────────────────────────────────
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .1s ease';
  });
});

// ── Magnetic buttons ──────────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.28;
    const dy   = (e.clientY - cy) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
    setTimeout(() => btn.style.transition = '', 400);
  });
  btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform .1s ease'; });
});

// ── Contact form ──────────────────────────────────────────────
const form     = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name || !data.email || !data.message) { statusEl.textContent = 'Please fill out all fields.'; return; }
  statusEl.textContent = 'Sending…';
  setTimeout(() => { statusEl.textContent = "Thanks — I'll be in touch soon!"; form.reset(); }, 700);
});

// ── Keyboard E = email ────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'e' && !/input|textarea/i.test(document.activeElement.tagName)) {
    window.location.href = 'mailto:marianaatom@outlook.com';
  }
});

// ── Reduced motion fallback ───────────────────────────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  document.documentElement.style.scrollBehavior = 'auto';
}
