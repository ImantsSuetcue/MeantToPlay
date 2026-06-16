// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Header background on scroll (transparent over hero, solid once scrolled)
// Only applies on pages with a full-screen hero carousel; other pages keep a solid header.
const header = document.querySelector('.site-header');
if (document.querySelector('.hero-carousel')) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Dropdown (click on mobile, hover on desktop via CSS)
document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const item = toggle.closest('li');
    const isOpen = item.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => revealObserver.observe(el));

// Hero carousel
const track = document.getElementById('carousel-track');
const slides = track ? Array.from(track.children) : [];
const dotsContainer = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const captionEl = document.getElementById('carousel-caption');

const captions = [
  'Etwas Neues ausprobieren',
  'Unterwegs',
  'Goldene Stunde',
  'Auf Reisen',
  'Gute Zeiten mit Freunden',
];

let currentSlide = 0;
let autoplayTimer;

if (track && slides.length) {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotsContainer.querySelectorAll('button').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
    if (captionEl) captionEl.textContent = captions[currentSlide] || '';
  }

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  resetAutoplay();
}

// Contact form (Web3Forms) with spam protection
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check: if this hidden field has a value, it's a bot
    if (form.botcheck.checked) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Wird gesendet...';
    status.className = 'form-status';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        status.textContent = 'Danke — ich melde mich bald bei dir.';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = 'Etwas ist schiefgelaufen. Bitte versuch es später nochmal.';
        status.className = 'form-status error';
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again later.';
      status.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
