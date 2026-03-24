/* ============================================================
   JOSIE HAIR BRAIDING — script.js
   Vanilla JS — mobile menu, sticky header, scroll reveal,
   stat counters, smooth scroll, back-to-top
   ============================================================ */

(function () {
  'use strict';

  /* ---- DOM REFERENCES ------------------------------------ */
  const header     = document.getElementById('site-header');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const backToTop  = document.getElementById('back-to-top');
  const revealEls  = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  /* ============================================================
     STICKY HEADER — add .scrolled on scroll
     ============================================================ */
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // run on load

  /* ============================================================
     MOBILE MENU TOGGLE
     ============================================================ */
  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on nav link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ============================================================
     SCROLL REVEAL — Intersection Observer
     ============================================================ */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============================================================
     STAT COUNTER ANIMATION
     ============================================================ */
  var statsAnimated = false;

  function animateStat(el) {
    var target  = parseFloat(el.getAttribute('data-target'));
    var decimal = parseInt(el.getAttribute('data-decimal') || '0', 10);
    var duration = 1600;
    var start = null;
    var startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = startVal + (target - startVal) * eased;
      el.textContent = current.toFixed(decimal);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimal);
      }
    }

    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(function (el) {
            animateStat(el);
          });
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  var statsBar = document.getElementById('stats');
  if (statsBar) statsObserver.observe(statsBar);

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  var headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
    10
  ) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      var offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
    });
  });

  /* ============================================================
     GALLERY IMAGE LIGHTBOX (simple overlay)
     ============================================================ */
  var galleryItems = document.querySelectorAll('.gallery-item');

  // Create lightbox elements
  var lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image lightbox');
  lightbox.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:9999',
    'background:rgba(20,12,8,0.92)',
    'align-items:center',
    'justify-content:center',
    'cursor:pointer',
    'padding:24px',
    'backdrop-filter:blur(6px)'
  ].join(';');

  var lbImg = document.createElement('img');
  lbImg.style.cssText = [
    'max-width:90vw',
    'max-height:85vh',
    'border-radius:12px',
    'box-shadow:0 24px 72px rgba(0,0,0,0.5)',
    'object-fit:contain',
    'display:block'
  ].join(';');

  var lbCaption = document.createElement('p');
  lbCaption.style.cssText = [
    'position:absolute',
    'bottom:32px',
    'left:50%',
    'transform:translateX(-50%)',
    'color:rgba(247,231,206,0.85)',
    'font-family:\'Cormorant Garamond\',Georgia,serif',
    'font-size:1.1rem',
    'font-style:italic',
    'letter-spacing:0.04em',
    'text-align:center',
    'white-space:nowrap'
  ].join(';');

  var lbClose = document.createElement('button');
  lbClose.innerHTML = '&times;';
  lbClose.setAttribute('aria-label', 'Close lightbox');
  lbClose.style.cssText = [
    'position:absolute',
    'top:20px',
    'right:24px',
    'background:rgba(247,231,206,0.12)',
    'border:1px solid rgba(247,231,206,0.25)',
    'border-radius:50%',
    'width:44px',
    'height:44px',
    'color:#F7E7CE',
    'font-size:1.6rem',
    'cursor:pointer',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'line-height:1',
    'transition:background 0.2s'
  ].join(';');

  lightbox.appendChild(lbImg);
  lightbox.appendChild(lbCaption);
  lightbox.appendChild(lbClose);
  document.body.appendChild(lightbox);

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      var caption = item.querySelector('.gallery-overlay span');
      if (img) {
        openLightbox(img.src, caption ? caption.textContent : img.alt);
      }
    });
    item.style.cursor = 'pointer';
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === lbClose) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });

  /* ============================================================
     HEADER HEIGHT CSS VARIABLE — update on resize
     ============================================================ */
  function updateHeaderHeight() {
    if (header) {
      document.documentElement.style.setProperty(
        '--header-h',
        header.offsetHeight + 'px'
      );
    }
  }

  window.addEventListener('resize', updateHeaderHeight, { passive: true });
  updateHeaderHeight();

  /* ============================================================
     ACTIVE NAV LINK ON SCROLL
     ============================================================ */
  var navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');
  var sections = [];

  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').replace('#', '');
    var section = document.getElementById(id);
    if (section) sections.push({ link: link, section: section });
  });

  function setActiveNav() {
    var scrollPos = window.scrollY + headerHeight + 80;

    sections.forEach(function (item) {
      var top = item.section.offsetTop;
      var bottom = top + item.section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (l) { l.removeAttribute('style'); });
        item.link.style.color = 'var(--primary)';
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ============================================================
     LAZY IMAGE FADE-IN
     ============================================================ */
  var lazyImgs = document.querySelectorAll('img[loading="lazy"]');

  lazyImgs.forEach(function (img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', function () {
        img.style.opacity = '1';
      });
    }
  });

  /* ============================================================
     INIT LOG
     ============================================================ */
  console.log('Josie Hair Braiding — site initialized.');

})();
