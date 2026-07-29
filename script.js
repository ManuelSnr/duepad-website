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
          setActive(currentTab); // Restart the CSS animation to sync with the JS timer
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

// Pro Modal Logic
const proModal = document.getElementById('proModal');
const openProModalBtn = document.getElementById('openProModalBtn');
const closeProModalIcon = document.getElementById('closeProModalIcon');

if (openProModalBtn && proModal) {
  openProModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    proModal.classList.add('active');
  });

  closeProModalIcon.addEventListener('click', () => {
    proModal.classList.remove('active');
  });

  proModal.addEventListener('click', (e) => {
    if (e.target === proModal) {
      proModal.classList.remove('active');
    }
  });
}

// Pro Waitlist Submit
document.getElementById('proWaitlistBtn').addEventListener('click', async function () {
  const input = document.getElementById('proEmailInput');
  const btn = this;

  if (input.value && input.value.includes('@')) {
    btn.textContent = 'Reserving...';
    btn.disabled = true;
    input.disabled = true;

    try {
      await fetch('https://script.google.com/macros/s/AKfycbwW5UIrmGFChtxzxS_CxaDi5KxKG-NUapJb0Zq4XWyWNXpO9kLw8dqgt8zQ5yu6p-n_-Q/exec', {
        method: 'POST',
        body: JSON.stringify({ email: '[PRO] ' + input.value }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        }
      });

      proModal.classList.remove('active');
      document.getElementById('proSuccessModal').classList.add('active');

      btn.textContent = "Reserve";
      btn.disabled = false;
      input.disabled = false;
      input.value = '';

      // Sync the main waitlist catcher state at the bottom of the page
      const mainWaitlistBtn = document.getElementById('waitlistBtn');
      const mainWaitlistInput = document.querySelector('.waitlist-form input');
      if (mainWaitlistBtn && mainWaitlistInput) {
        mainWaitlistBtn.textContent = "You're on the list ✓";
        mainWaitlistBtn.style.background = '#2D6A4F';
        mainWaitlistBtn.disabled = true;
        mainWaitlistInput.disabled = true;
        mainWaitlistInput.value = '';
      }
    } catch (error) {
      console.error('Pro waitlist submission failed:', error);
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
    if (this.id === 'openProModalBtn') return; // Skip modal triggers

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

document.getElementById('closeProSuccessModalBtn').addEventListener('click', () => {
  document.getElementById('proSuccessModal').classList.remove('active');
});

document.getElementById('proSuccessModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('proSuccessModal')) {
    document.getElementById('proSuccessModal').classList.remove('active');
  }
});

// Pricing Toggle
const pricingToggleWrap = document.getElementById('pricing-toggle-wrap');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');
const proPrice = document.getElementById('pro-price');
const proPeriod = document.getElementById('pro-period');
const proDiscount = document.getElementById('pro-discount');

if (pricingToggleWrap) {
  let isYearly = false;

  function updatePricing() {
    if (isYearly) {
      pricingToggleWrap.classList.add('yearly');
      yearlyLabel.classList.add('active');
      monthlyLabel.classList.remove('active');
      proPrice.textContent = '$29.90';
      proPeriod.textContent = '/yr';
      proDiscount.innerHTML = '<s>$39.90/yr</s> · Founding member pricing';
    } else {
      pricingToggleWrap.classList.remove('yearly');
      monthlyLabel.classList.add('active');
      yearlyLabel.classList.remove('active');
      proPrice.textContent = '$2.99';
      proPeriod.textContent = '/mo';
      proDiscount.innerHTML = '<s>$3.99/mo</s> · Founding member pricing';
    }
  }

  monthlyLabel.addEventListener('click', () => {
    isYearly = false;
    updatePricing();
  });

  yearlyLabel.addEventListener('click', () => {
    isYearly = true;
    updatePricing();
  });
}
