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
  
  // Only auto-play when the features section is in view to prevent layout jumps
  const featuresSection = document.querySelector('.features-body');
  if (featuresSection) {
    const playObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTabInterval();
        } else {
          clearInterval(tabInterval);
        }
      });
    }, { threshold: 0.1 });
    playObserver.observe(featuresSection);
  } else {
    startTabInterval();
  }
}

// Waitlist form
document.getElementById('waitlistBtn').addEventListener('click', async function () {
  const input = document.querySelector('.waitlist-form input');
  const btn = this;

  if (input.value && input.value.includes('@')) {
    const originalText = btn.textContent;
    btn.textContent = 'Joining...';
    btn.disabled = true;
    input.disabled = true;

    try {
      // Send data to Google Sheets via Apps Script Web App
      // Using text/plain prevents CORS preflight issues with Google Script redirects
      await fetch('https://script.google.com/macros/s/AKfycbwW5UIrmGFChtxzxS_CxaDi5KxKG-NUapJb0Zq4XWyWNXpO9kLw8dqgt8zQ5yu6p-n_-Q/exec', {
        method: 'POST',
        body: JSON.stringify({ email: input.value }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        }
      });
      
      document.getElementById('successModal').classList.add('active');
      
      btn.textContent = "You're on the list ✓";
      btn.style.background = '#2D6A4F';
      input.value = '';
    } catch (error) {
      console.error('Waitlist submission failed:', error);
      btn.textContent = 'Error. Try again';
      btn.disabled = false;
      input.disabled = false;
    }
  } else {
    input.style.borderColor = '#C0392B';
    setTimeout(() => input.style.borderColor = '', 1500);
  }
});

// Smooth scroll without updating URL hash
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// FAQ Accordion
document.querySelectorAll('.faq-item.active').forEach(item => {
  const answer = item.querySelector('.faq-a');
  if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
});

document.querySelectorAll('.faq-q').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-a').style.maxHeight = null;
    });
    
    // If it wasn't active, open it
    if (!isActive) {
      item.classList.add('active');
      const answer = item.querySelector('.faq-a');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
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
