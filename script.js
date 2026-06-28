/* ============================================================
   AL HADI TRADERS – script.js
   Handles: sticky nav, mobile menu, scroll animations,
   contact form validation, scroll-to-top
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM REFS ─────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const scrollBtn = document.getElementById('scrollTop');
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('formSuccess');

  /* ── HERO FADE-UP ON LOAD ────────────────────────────── */
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero-content .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('animated'), i * 150 + 100);
    });
  });

  /* ── NAVBAR: SCROLL EFFECT ───────────────────────────── */
  function onScroll() {
    /* Sticky nav appearance */
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    /* Scroll-to-top button */
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── HAMBURGER MENU ──────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    hamburger.setAttribute(
      'aria-label',
      navLinks.classList.contains('open') ? 'Close menu' : 'Open menu'
    );
  });

  /* Close mobile menu on link click */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navbar.contains(e.target)
    ) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  /* ── INTERSECTION OBSERVER: REVEAL ──────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /* Stagger children within a grid/list */
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          siblings.forEach((el, i) => {
            if (!el.classList.contains('animated')) {
              setTimeout(() => el.classList.add('animated'), i * 80);
            }
          });
          entry.target.classList.add('animated');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── SMOOTH SCROLL for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── SCROLL TO TOP ───────────────────────────────────── */
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── CONTACT FORM VALIDATION ─────────────────────────── */
  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('nameError'),    label: 'Full name' },
    email:   { el: document.getElementById('email'),   err: document.getElementById('emailError'),   label: 'Email address' },
    subject: { el: document.getElementById('subject'), err: document.getElementById('subjectError'), label: 'Subject' },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError'), label: 'Message' },
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearError(field) {
    field.el.classList.remove('error');
    field.err.textContent = '';
  }

  function setError(field, msg) {
    field.el.classList.add('error');
    field.err.textContent = msg;
  }

  function validateForm() {
    let valid = true;

    /* Name */
    const name = fields.name.el.value.trim();
    clearError(fields.name);
    if (!name) {
      setError(fields.name, 'Please enter your full name.');
      valid = false;
    } else if (name.length < 2) {
      setError(fields.name, 'Name must be at least 2 characters.');
      valid = false;
    }

    /* Email */
    const email = fields.email.el.value.trim();
    clearError(fields.email);
    if (!email) {
      setError(fields.email, 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email)) {
      setError(fields.email, 'Please enter a valid email address.');
      valid = false;
    }

    /* Subject */
    const subject = fields.subject.el.value.trim();
    clearError(fields.subject);
    if (!subject) {
      setError(fields.subject, 'Please enter a subject.');
      valid = false;
    }

    /* Message */
    const message = fields.message.el.value.trim();
    clearError(fields.message);
    if (!message) {
      setError(fields.message, 'Please enter your message.');
      valid = false;
    } else if (message.length < 10) {
      setError(fields.message, 'Message must be at least 10 characters.');
      valid = false;
    }

    return valid;
  }

  /* Live validation on blur */
  Object.values(fields).forEach(field => {
    field.el.addEventListener('blur', () => {
      const val = field.el.value.trim();
      clearError(field);
      if (!val) {
        setError(field, `${field.label} is required.`);
      } else if (field === fields.email && !validateEmail(val)) {
        setError(field, 'Please enter a valid email address.');
      }
    });
    field.el.addEventListener('input', () => clearError(field));
  });

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    /* Disable button and show loading */
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending…';

    /* Simulate async submission */
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 6000);

      /* Scroll success into view */
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1400);
  });

  /* ── ACTIVE NAV LINK on scroll ───────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchorLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

})();
