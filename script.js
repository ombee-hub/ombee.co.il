/* ─────────────────────────────────────────────
   OMBee Studio — script.js
───────────────────────────────────────────── */

/* ── FAILSAFE ────────────────────────────────────
   מבטיח שהתוכן לעולם לא יישאר מוסתר (opacity:0) גם אם משהו אחר
   בסקריפט נכשל. נקבע ראשון, לפני כל קוד שעלול לזרוק שגיאה. */
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
}, 1600);

/* ── CURSOR ─────────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower && getComputedStyle(cursor).display !== 'none') {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  };
  animateFollower();
}

/* ── HEADER SCROLL ───────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER / MOBILE MENU ─────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobOverlay  = document.getElementById('mobOverlay');
const mobileLinks = document.querySelectorAll('.mobile-menu__link');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  if (mobOverlay) mobOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const opening = !mobileMenu.classList.contains('open');
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  if (mobOverlay) mobOverlay.classList.toggle('open');
  document.body.style.overflow = opening ? 'hidden' : '';
});

if (mobOverlay) {
  mobOverlay.addEventListener('click', closeMobileMenu);
}

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 840 && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

/* ── MOBILE SOLUTIONS SUBMENU ─────────────────── */
const mobToggle = document.getElementById('mobSolutionsToggle');
const mobSubmenu = document.getElementById('mobSubmenu');
if (mobToggle && mobSubmenu) {
  mobToggle.addEventListener('click', e => {
    e.preventDefault();
    // Tapping anywhere on the row toggles the sub-menu
    mobToggle.classList.toggle('open');
    mobSubmenu.classList.toggle('open');
  });
}

/* ── SCROLL REVEAL ───────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings slightly (capped so fast scrolling never waits long)
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 50, 200));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 150px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── TESTIMONIALS SLIDER ─────────────────────── */
const track = document.getElementById('testimonialTrack');
const dots  = document.querySelectorAll('#testimonialDots .dot');
let current = 0;

// רץ רק בדפים שבהם קיים מחוון ההמלצות (אחרת track הוא null וזורק שגיאה שעוצרת את הסקריפט)
if (track && dots.length) {
  const goTo = (index) => {
    current = index;
    const cardWidth = track.querySelector('.t-card').offsetWidth + 24; // +gap
    // RTL: scroll in positive direction
    track.style.transform = `translateX(${index * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });

  // Auto-advance
  setInterval(() => {
    goTo((current + 1) % dots.length);
  }, 5000);

  // Touch/drag support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? Math.min(current + 1, dots.length - 1) : Math.max(current - 1, 0));
  });
}

/* ── SMOOTH NAV LINKS ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── ACTIVE NAV HIGHLIGHT ────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => {
        l.style.color = '';
        l.style.fontWeight = '';
        if (l.getAttribute('href') === '#' + entry.target.id) {
          if (!l.classList.contains('nav__link--cta')) {
            const isScrolled = header.classList.contains('scrolled');
            l.style.color = isScrolled ? '#0A0A0A' : 'rgba(255,255,255,1)';
            l.style.fontWeight = '700';
          }
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── CONTACT FORM (EmailJS — מייל מעוצב) ─────────── */
const form = document.getElementById('contactForm');
if (form) {
  const val = id => {
    const el = document.getElementById(id);
    if (!el) return '';
    if (el.tagName === 'SELECT') {
      return el.value ? el.options[el.selectedIndex].text.trim() : '';
    }
    return el.value.trim();
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    // honeypot — אם מולא, כנראה בוט: מדמים הצלחה ולא שולחים
    if (document.getElementById('website') && document.getElementById('website').value) {
      return;
    }

    // בדיקת תקינות בסיסית של שדות חובה
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // ודא שספריית EmailJS והמזהים הוגדרו
    const cfg = window.EMAILJS_CONFIG || {};
    if (!window.emailjs || !cfg.serviceId || cfg.serviceId.indexOf('YOUR_') === 0) {
      console.error('EmailJS לא הוגדר — יש למלא את publicKey / serviceId / templateId ב-contact.html');
      btn.innerHTML = '✗ הטופס לא מוגדר עדיין';
      btn.style.background = '#e23b3b';
      setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; }, 3500);
      return;
    }

    // פרמטרים שנשלחים לתבנית המעוצבת ב-EmailJS
    const params = {
      name:       val('name')       || '—',
      email:      val('email')      || '—',
      phone:      val('phone')      || '—',
      company:    val('company')    || '—',
      company_id: val('company-id') || '—',
      service:    val('service')    || '—',
      message:    val('message')    || '—',
      subject:    'פנייה חדשה מאתר OMBee' + (val('name') ? ' — ' + val('name') : ''),
      reply_to:   val('email'),
      time:       new Date().toLocaleString('he-IL')
    };

    btn.disabled = true;
    btn.innerHTML = 'שולח…';

    try {
      await emailjs.send(cfg.serviceId, cfg.templateId, params);
      btn.innerHTML = '✓ נשלח בהצלחה!';
      btn.style.background = '#28c840';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } catch (err) {
      console.error('שגיאה בשליחת הטופס:', err);
      btn.innerHTML = '✗ שגיאה — נסה שוב';
      btn.style.background = '#e23b3b';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }
  });
}

/* ── COUNTER ANIMATION ───────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.textContent);
  const suffix = el.textContent.replace(/[0-9]/g, '');
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num').forEach(el => counterObserver.observe(el));
