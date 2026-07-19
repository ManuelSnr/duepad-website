// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

// Reveal on scroll
const ro = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// Tab logic for features section
const tabs = document.querySelectorAll('.feature-tab');
const panels = document.querySelectorAll('.asset-card');
let currentTab = 0;
let tabInterval;

function setActive(idx) {
  currentTab = idx;
  
  // Remove active from all to reset state
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  
  // Force a reflow to restart the CSS progress bar animation
  void tabs[idx].offsetWidth;
  
  // Add active state to target
  tabs[idx].classList.add('active');
  panels[idx].classList.add('active');
}

function startTabInterval() {
  clearInterval(tabInterval);
  tabInterval = setInterval(() => {
    if (tabs.length > 0) {
      let nextTab = (currentTab + 1) % tabs.length;
      setActive(nextTab);
    }
  }, 5000);
}

// Click tab → switch active panel
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    setActive(i);
    startTabInterval(); // Reset timer when user interacts
  });
});

// Initialize first tab and auto-play
if (tabs.length > 0) {
  setActive(0);
  startTabInterval();
}

// Waitlist form
document.getElementById('waitlistBtn').addEventListener('click', function () {
  const input = document.querySelector('.waitlist-form input');
  const btn = this;

  if (input.value && input.value.includes('@')) {
    const originalText = btn.textContent;
    btn.textContent = 'Joining...';
    btn.disabled = true;
    input.disabled = true;

    // Simulate network request
    setTimeout(() => {
      document.getElementById('successModal').classList.add('active');
      
      btn.textContent = "You're on the list ✓";
      btn.style.background = '#2D6A4F';
      input.value = '';
    }, 1000);
  } else {
    input.style.borderColor = '#C0392B';
    setTimeout(() => input.style.borderColor = '', 1500);
  }
});

// Modal close logic
document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('successModal').classList.remove('active');
});

document.getElementById('successModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('successModal')) {
    document.getElementById('successModal').classList.remove('active');
  }
});
