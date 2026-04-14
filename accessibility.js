/* ─────────────────────────────────────────────
   OMBee Studio — Accessibility Widget
   Styled to match standard Israeli accessibility widget
───────────────────────────────────────────── */
(function () {
  const STORAGE_KEY = 'ombee-a11y';

  const features = [
    { id: 'links',       label: 'הדגשת קישורים',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' },
    { id: 'contrast',    label: '+ ניגודיות',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor"/></svg>' },
    { id: 'spacing',     label: 'ריווח טקסט',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14"/><path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/></svg>' },
    { id: 'bigText',     label: 'טקסט גדול',         icon: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="2" y="19" font-size="18" font-weight="bold" font-family="Arial">T</text><text x="13" y="19" font-size="14" font-weight="bold" font-family="Arial">T</text></svg>' },
    { id: 'hideImages',  label: 'הסתרת תמונות',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/><line x1="3" y1="3" x2="21" y2="21" stroke-width="2.5"/></svg>' },
    { id: 'stopAnim',    label: 'ביטול הנפשות',      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l3 3"/><line x1="4" y1="4" x2="20" y2="20" stroke-width="2.5"/></svg>' },
    { id: 'bigCursor',   label: 'סמן',               icon: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3l14 7-6 2-2 6z"/><line x1="13" y1="13" x2="20" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>' },
    { id: 'dyslexia',    label: 'תמיכה בדיסלקסיה',   icon: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="2" y="19" font-size="17" font-weight="bold" font-family="Arial">Df</text></svg>' },
    { id: 'lineHeight',  label: 'גובה שורה',         icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h12M6 12h12M6 20h12"/><path d="M3 7l-1-3 1 0"/><path d="M3 17l-1 3 1 0"/><line x1="2" y1="7" x2="2" y2="17"/></svg>' },
    { id: 'altText',     label: 'תאורים',            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="7" y1="14" x2="13" y2="14"/></svg>' },
    { id: 'saturation',  label: 'רוי',               icon: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z"/></svg>' },
    { id: 'textAlign',   label: 'יישור טקסט',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="3" y1="18" x2="15" y2="18"/></svg>' },
  ];

  // ── Load saved state ──
  let state = {};
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (_) {}

  // ── Inject CSS ──
  const style = document.createElement('style');
  style.textContent = `
/* ── A11y Floating Button ── */
.ombee-a11y-btn{
  position:fixed;bottom:24px;left:24px;z-index:10000;
  width:56px;height:56px;border-radius:50%;border:none;
  background:#00B3DD;color:#fff;cursor:pointer;
  box-shadow:0 4px 20px rgba(0,179,221,.4);
  display:flex;align-items:center;justify-content:center;
  transition:all .3s ease;
}
.ombee-a11y-btn:hover{
  transform:scale(1.08);
  box-shadow:0 6px 28px rgba(0,179,221,.5);
}
.ombee-a11y-btn svg{width:30px;height:30px}
.ombee-a11y-btn.active{background:#0a8dab}

/* ── Panel ── */
.ombee-a11y-panel{
  position:fixed;bottom:24px;left:24px;z-index:10001;
  width:320px;max-height:calc(100vh - 48px);overflow-y:auto;
  background:#fff;border-radius:24px;
  box-shadow:0 8px 40px rgba(0,0,0,.18);
  opacity:0;pointer-events:none;
  transform:translateY(12px) scale(.97);
  transition:opacity .25s ease, transform .25s ease;
  direction:rtl;font-family:'Heebo',sans-serif;
}
.ombee-a11y-panel.open{
  opacity:1;pointer-events:all;
  transform:translateY(0) scale(1);
}
.ombee-a11y-panel::-webkit-scrollbar{width:4px}
.ombee-a11y-panel::-webkit-scrollbar-thumb{background:rgba(0,179,221,.3);border-radius:4px}

/* ── Panel Header ── */
.ombee-a11y-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 20px 14px;border-bottom:1px solid #f0f0f0;
  position:sticky;top:0;background:#fff;z-index:1;
  border-radius:24px 24px 0 0;
}
.ombee-a11y-title{
  font-size:16px;font-weight:800;color:#1a1a2e;
  flex:1;text-align:center;
}
.ombee-a11y-close{
  width:30px;height:30px;border-radius:50%;border:1.5px solid #e0e0e0;
  background:#fff;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s;color:#888;flex-shrink:0;
}
.ombee-a11y-close:hover{background:#f5f5f5;border-color:#ccc}
.ombee-a11y-close svg{width:14px;height:14px}

/* ── Feature Grid ── */
.ombee-a11y-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:10px;
  padding:16px;
}
.ombee-a11y-item{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;
  gap:10px;padding:18px 8px 14px;border-radius:16px;
  border:1.5px solid #eaeaea;
  background:#fff;cursor:pointer;transition:all .2s;
  text-align:center;min-height:90px;position:relative;
}
.ombee-a11y-item:hover{
  border-color:#00B3DD;background:rgba(0,179,221,.03);
}
.ombee-a11y-item.on{
  background:rgba(0,179,221,.08);border-color:#00B3DD;
}
.ombee-a11y-item.on .ombee-a11y-item-icon{color:#00B3DD}
.ombee-a11y-item-icon{
  width:32px;height:32px;display:flex;align-items:center;justify-content:center;
  color:#444;transition:color .2s;
}
.ombee-a11y-item.on .ombee-a11y-item-icon{color:#00B3DD}
.ombee-a11y-item-icon svg{width:26px;height:26px}
.ombee-a11y-item-label{font-size:12px;font-weight:600;color:#333;line-height:1.3}
.ombee-a11y-item.on .ombee-a11y-item-label{color:#00B3DD}
.ombee-a11y-item .ombee-a11y-dot{
  position:absolute;top:8px;right:8px;width:8px;height:8px;
  border-radius:50%;background:#00B3DD;display:none;
}
.ombee-a11y-item.on .ombee-a11y-dot{display:block}

/* ── Reset Button ── */
.ombee-a11y-reset{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:calc(100% - 32px);margin:0 16px 12px;padding:13px;
  border:none;border-radius:50px;
  background:#00B3DD;color:#fff;font-size:14px;font-weight:700;
  font-family:'Heebo',sans-serif;cursor:pointer;transition:all .25s;
}
.ombee-a11y-reset:hover{background:#00a0c8;transform:translateY(-1px)}
.ombee-a11y-reset svg{width:18px;height:18px}

/* ── Bottom Bar ── */
.ombee-a11y-bottom{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 20px 14px;border-top:1px solid #f0f0f0;
  font-size:12px;color:#888;
}
.ombee-a11y-bottom-link{
  display:flex;align-items:center;gap:4px;
  cursor:pointer;transition:color .2s;background:none;border:none;
  font-family:'Heebo',sans-serif;font-size:12px;color:#888;
}
.ombee-a11y-bottom-link:hover{color:#00B3DD}
.ombee-a11y-bottom-link svg{width:16px;height:16px}

/* ── Applied A11y Styles ── */
html.a11y-contrast{filter:contrast(1.4)!important}
html.a11y-bigText{font-size:125%!important}
html.a11y-spacing{letter-spacing:.08em!important;word-spacing:.16em!important}
html.a11y-links a{text-decoration:underline!important;outline:2px solid #00B3DD!important;outline-offset:2px!important}
html.a11y-hideImages img{opacity:0!important}
html.a11y-stopAnim *{animation:none!important;transition:none!important}
html.a11y-bigCursor,html.a11y-bigCursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M8 8l12 30 5-15 15-5z' fill='%2300B3DD' stroke='%23fff' stroke-width='2'/%3E%3C/svg%3E") 8 8,auto!important}
html.a11y-dyslexia *{font-family:'Comic Sans MS','OpenDyslexic',sans-serif!important}
html.a11y-lineHeight{line-height:2.2!important}
html.a11y-lineHeight *{line-height:inherit!important}
html.a11y-altText img[alt]::after{content:attr(alt);display:block;font-size:12px;color:#00B3DD;background:rgba(0,179,221,.08);padding:4px 8px;border-radius:4px;margin-top:4px}
html.a11y-saturation{filter:saturate(0)!important}
html.a11y-textAlign,html.a11y-textAlign *{text-align:right!important}

/* ── Mobile ── */
@media(max-width:480px){
  .ombee-a11y-panel{left:8px;right:8px;width:auto;bottom:16px}
  .ombee-a11y-btn{bottom:16px;left:16px;width:50px;height:50px}
  .ombee-a11y-btn svg{width:26px;height:26px}
}
`;
  document.head.appendChild(style);

  // ── Build HTML ──
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
<button class="ombee-a11y-btn" aria-label="תפריט נגישות" title="נגישות">
  <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="4" r="2"/><path d="M12 8c-3.5 0-6.5 1-8 2l1 2c1.2-.8 3.8-1.5 6-1.7V13l-3.5 7h2.2l2.3-5 2.3 5h2.2L13 13v-2.7c2.2.2 4.8.9 6 1.7l1-2c-1.5-1-4.5-2-8-2z"/></svg>
</button>
<div class="ombee-a11y-panel">
  <div class="ombee-a11y-header">
    <div style="width:30px"></div>
    <div class="ombee-a11y-title">יישומון גדול</div>
    <button class="ombee-a11y-close" aria-label="סגור">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
    </button>
  </div>
  <div class="ombee-a11y-grid">
    ${features.map(f => `
      <div class="ombee-a11y-item" data-feature="${f.id}">
        <div class="ombee-a11y-dot"></div>
        <div class="ombee-a11y-item-icon">${f.icon}</div>
        <div class="ombee-a11y-item-label">${f.label}</div>
      </div>
    `).join('')}
  </div>
  <button class="ombee-a11y-reset">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
    איפוס את כל הגדרות הנגישות
  </button>
  <div class="ombee-a11y-bottom">
    <a href="accessibility-statement.html" class="ombee-a11y-bottom-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      הצהרת נגישות
    </a>
    <a href="privacy-policy.html" class="ombee-a11y-bottom-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      מדיניות פרטיות
    </a>
  </div>
</div>`;

  document.body.appendChild(wrapper);

  const btn   = wrapper.querySelector('.ombee-a11y-btn');
  const panel = wrapper.querySelector('.ombee-a11y-panel');
  const close = wrapper.querySelector('.ombee-a11y-close');
  const items = wrapper.querySelectorAll('.ombee-a11y-item');
  const reset = wrapper.querySelector('.ombee-a11y-reset');

  // ── Apply saved state on load ──
  function applyState() {
    features.forEach(f => {
      const isOn = !!state[f.id];
      document.documentElement.classList.toggle('a11y-' + f.id, isOn);
      const el = wrapper.querySelector(`[data-feature="${f.id}"]`);
      if (el) el.classList.toggle('on', isOn);
    });
    btn.classList.toggle('active', Object.values(state).some(Boolean));
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  applyState();

  // ── Toggle panel ──
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      btn.style.display = 'none';
    }
  });

  close.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.remove('open');
    btn.style.display = '';
  });

  // Prevent panel clicks from closing
  panel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Click outside to close
  document.addEventListener('click', () => {
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
      btn.style.display = '';
    }
  });

  // ── Toggle features ──
  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.feature;
      state[id] = !state[id];
      save();
      applyState();
    });
  });

  // ── Reset ──
  reset.addEventListener('click', () => {
    state = {};
    save();
    applyState();
  });

  // ── Bottom bar: toggle widget visibility ──
  const toggleBtn = wrapper.querySelector('[data-action="toggle-widget"]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      btn.style.display = '';
    });
  }

  // ── Keyboard: Escape closes panel ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      panel.classList.remove('open');
      btn.style.display = '';
    }
  });
})();

/* ─────────────────────────────────────────────
   OMBee Studio — Cookie Consent Banner
───────────────────────────────────────────── */
(function () {
  const COOKIE_KEY = 'ombee-cookies-accepted';
  if (localStorage.getItem(COOKIE_KEY)) return;

  const css = document.createElement('style');
  css.textContent = `
.ombee-cookie-banner{
  position:fixed;bottom:0;left:0;right:0;z-index:9999;
  background:#fff;border-top:1.5px solid rgba(0,179,221,.15);
  box-shadow:0 -4px 24px rgba(0,0,0,.1);
  padding:18px 28px;
  display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;
  direction:rtl;font-family:'Heebo',sans-serif;
  transform:translateY(100%);
  animation:ombee-cookie-slide .4s ease forwards;
}
@keyframes ombee-cookie-slide{to{transform:translateY(0)}}
.ombee-cookie-banner.hide{
  animation:ombee-cookie-hide .3s ease forwards;
}
@keyframes ombee-cookie-hide{to{transform:translateY(100%);opacity:0}}
.ombee-cookie-text{
  font-size:14px;color:#444;line-height:1.6;flex:1;min-width:240px;
}
.ombee-cookie-text a{color:#00B3DD;font-weight:600;text-decoration:underline}
.ombee-cookie-text a:hover{opacity:.7}
.ombee-cookie-actions{display:flex;gap:10px;flex-shrink:0}
.ombee-cookie-accept{
  padding:10px 28px;border:none;border-radius:50px;
  background:#00B3DD;color:#fff;font-size:14px;font-weight:700;
  font-family:'Heebo',sans-serif;cursor:pointer;transition:all .25s;
  white-space:nowrap;
}
.ombee-cookie-accept:hover{background:#00a0c8;transform:translateY(-1px)}
.ombee-cookie-decline{
  padding:10px 28px;border:1.5px solid #ddd;border-radius:50px;
  background:#fff;color:#666;font-size:14px;font-weight:600;
  font-family:'Heebo',sans-serif;cursor:pointer;transition:all .25s;
  white-space:nowrap;
}
.ombee-cookie-decline:hover{border-color:#aaa;color:#333}
@media(max-width:600px){
  .ombee-cookie-banner{flex-direction:column;text-align:center;padding:16px 20px;gap:12px}
  .ombee-cookie-text{min-width:auto}
}
`;
  document.head.appendChild(css);

  const banner = document.createElement('div');
  banner.className = 'ombee-cookie-banner';
  banner.innerHTML = `
    <div class="ombee-cookie-text">
      אתר זה משתמש בעוגיות (Cookies) כדי לשפר את חוויית הגלישה שלך.
      לפרטים נוספים ניתן לעיין ב<a href="privacy-policy.html">מדיניות הפרטיות</a>.
    </div>
    <div class="ombee-cookie-actions">
      <button class="ombee-cookie-accept">קבל</button>
      <button class="ombee-cookie-decline">ביטול</button>
    </div>
  `;
  document.body.appendChild(banner);

  banner.querySelector('.ombee-cookie-accept').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, '1');
    banner.classList.add('hide');
    setTimeout(() => banner.remove(), 350);
  });

  banner.querySelector('.ombee-cookie-decline').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, '0');
    banner.classList.add('hide');
    setTimeout(() => banner.remove(), 350);
  });
})();
