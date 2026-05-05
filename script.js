// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

// Reveal on scroll
const ro = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// Asset card reveal
const ar = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.asset-card').forEach(c => ar.observe(c));

// Loom-style scroll: observe panels, activate left tabs
const tabs = document.querySelectorAll('.feature-tab');
const panels = document.querySelectorAll('.asset-card');

function setActive(idx) {
  tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
}

const po = new IntersectionObserver(
  es => {
    es.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio >= 0.4) {
        setActive(parseInt(e.target.dataset.panel));
      }
    });
  },
  { threshold: 0.4 }
);
panels.forEach(p => po.observe(p));

// Click tab → scroll to panel
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    panels[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

// Waitlist form
document.getElementById('waitlistBtn').addEventListener('click', function () {
  const input = document.querySelector('.waitlist-form input');
  if (input.value && input.value.includes('@')) {
    this.textContent = "You're on the list ✓";
    this.style.background = '#2D6A4F';
    input.disabled = true;
    this.disabled = true;
  } else {
    input.style.borderColor = '#C0392B';
    setTimeout(() => input.style.borderColor = '', 1500);
  }
});
