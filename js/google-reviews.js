/* ─────────────────────────────────────────────
   OMBee Studio — Google Reviews (live from Google Places)
   The placeholder stays empty (no height) until API_KEY and PLACE_ID are set
   and Google returns reviews. Google's script loads only when
   the section is about to scroll into view, so page load is unaffected.
───────────────────────────────────────────── */
(function () {
  /* ── הגדרות: למלא כאן את המפתח ומזהה העסק ── */
  var API_KEY  = '';   // Google Maps JavaScript API key (restricted to ombee.co.il)
  var PLACE_ID = '';   // Google Place ID (ChIJ...) — optional; if empty it is looked up once by name+location and cached
  var PLACE_QUERY = 'OMBee-Grahpics Desiger and UI/UX';        // the business name as it appears on Google Maps
  var PLACE_LOC   = { lat: 31.9107414, lng: 35.0114023 };      // business pin
  var MAPS_URL    = 'https://maps.app.goo.gl/YvQXDfdnwJtFSmN67';

  var root = document.getElementById('googleReviews');
  if (!root || !API_KEY) return;

  var css = document.createElement('style');
  css.textContent = [
    '.greviews{margin-top:44px}',
    '.greviews[data-no-header]{margin-top:0}',
    '.greviews-summary{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin:-6px 0 34px}',
    '.greviews-g{width:30px;height:30px;flex-shrink:0}',
    '.greviews-score{font-size:34px;font-weight:900;color:#00164D;line-height:1}',
    '.greviews-stars{color:#FBBC04;font-size:20px;letter-spacing:2px;line-height:1}',
    '.greviews-count{font-size:14px;color:#6B7280}',
    '.greviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}',
    '.greview{background:#fff url("images/hero-bg.webp") center/cover no-repeat;border:1.5px solid rgba(1,92,253,.18);border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:14px;min-width:0}',
    '.greview-head{display:flex;align-items:center;gap:12px}',
    '.greview-av{width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0;background:#015CFD}',
    '.greview-av.ph{display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px}',
    '.greview-name{font-size:15px;font-weight:700;color:#00164D;line-height:1.3}',
    '.greview-name a{color:inherit}',
    '.greview-time{font-size:12.5px;color:#6B7280}',
    '.greview-stars{color:#FBBC04;font-size:16px;letter-spacing:2px}',
    '.greview-text{font-size:15px;line-height:1.75;color:#00164D;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}',
    '.greview-text.open{-webkit-line-clamp:unset;display:block}',
    '.greview-more{align-self:flex-start;background:none;border:none;color:#015CFD;font-weight:700;font-size:14px;cursor:pointer;padding:0;font-family:inherit}',
    '.greviews-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:36px}',
    '.greviews-actions .btn-out{background:#fff}',
    '.greviews-credit{text-align:center;font-size:12px;color:#8FA6D6;margin-top:16px}',
    '@media(max-width:900px){.greviews-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;padding-bottom:8px;-webkit-overflow-scrolling:touch}.greview{flex:0 0 85%;scroll-snap-align:center}}'
  ].join('\n');
  document.head.appendChild(css);

  var G_LOGO = '<svg class="greviews-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';

  function stars(n) {
    var r = Math.round(n || 0), s = '';
    for (var i = 0; i < 5; i++) s += i < r ? '★' : '☆';
    return s;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function render(place) {
    var reviews = (place.reviews || []).filter(function (r) { return r.text; });
    if (!reviews.length) return;

    var mapsUrl = place.googleMapsURI || MAPS_URL;
    var writeUrl = 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(place.id);

    var wrap = el('div');
    if (!root.dataset.noHeader) {
      wrap.innerHTML =
        '<div class="section-header reveal visible"><p class="eyebrow">ביקורות בגוגל</p>' +
        '<h2 class="section-title">מה כתבו עליי <span class="title-out">בגוגל</span></h2></div>';
    }

    var sum = el('div', 'greviews-summary');
    sum.innerHTML = G_LOGO;
    sum.appendChild(el('span', 'greviews-score', (place.rating || 0).toFixed(1)));
    sum.appendChild(el('span', 'greviews-stars', stars(place.rating)));
    if (place.userRatingCount) sum.appendChild(el('span', 'greviews-count', 'מבוסס על ' + place.userRatingCount + ' ביקורות'));
    wrap.appendChild(sum);

    var grid = el('div', 'greviews-grid');
    reviews.forEach(function (r) {
      var a = r.authorAttribution || {};
      var card = el('article', 'greview');
      var head = el('div', 'greview-head');
      if (a.photoURI) {
        var img = el('img', 'greview-av');
        img.src = a.photoURI; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
        head.appendChild(img);
      } else {
        head.appendChild(el('div', 'greview-av ph', (a.displayName || '?').trim().charAt(0)));
      }
      var who = el('div');
      var name = el('div', 'greview-name');
      if (a.uri) { var link = el('a', null, a.displayName || ''); link.href = a.uri; link.target = '_blank'; link.rel = 'noopener'; name.appendChild(link); }
      else name.textContent = a.displayName || '';
      who.appendChild(name);
      who.appendChild(el('div', 'greview-time', r.relativePublishTimeDescription || ''));
      head.appendChild(who);
      card.appendChild(head);
      card.appendChild(el('div', 'greview-stars', stars(r.rating)));
      var text = el('p', 'greview-text', r.text);
      text.dir = 'auto';
      card.appendChild(text);
      var more = el('button', 'greview-more', 'קרא/י עוד');
      more.type = 'button';
      more.addEventListener('click', function () {
        var open = text.classList.toggle('open');
        more.textContent = open ? 'הצג פחות' : 'קרא/י עוד';
      });
      card.appendChild(more);
      grid.appendChild(card);
      requestAnimationFrame(function () { if (text.scrollHeight <= text.clientHeight + 2) more.remove(); });
    });
    wrap.appendChild(grid);

    var actions = el('div', 'greviews-actions');
    actions.innerHTML =
      '<a class="btn btn-out" target="_blank" rel="noopener" href="' + mapsUrl + '">לכל הביקורות בגוגל</a>' +
      '<a class="btn btn-cy" target="_blank" rel="noopener" href="' + writeUrl + '">כתבו ביקורת</a>';
    wrap.appendChild(actions);
    wrap.appendChild(el('div', 'greviews-credit', 'הביקורות מוצגות ישירות מ-Google'));

    root.innerHTML = '';
    root.appendChild(wrap);
    root.className = 'greviews';
    /* Google reviews take the place of the on-site testimonials */
    if (root.dataset.replace) {
      document.querySelectorAll(root.dataset.replace).forEach(function (n) { n.style.display = 'none'; });
    }
  }

  /* מוצא את מזהה העסק פעם אחת לפי שם ומיקום ושומר אותו בדפדפן */
  function resolveId(lib) {
    if (PLACE_ID) return Promise.resolve(PLACE_ID);
    var KEY = 'ombee-place-id';
    try { var c = localStorage.getItem(KEY); if (c) return Promise.resolve(c); } catch (e) {}
    return lib.Place.searchByText({ textQuery: PLACE_QUERY, fields: ['id'], locationBias: PLACE_LOC, maxResultCount: 1 })
      .then(function (r) {
        var id = r.places && r.places[0] && r.places[0].id;
        if (!id) throw new Error('place not found');
        try { localStorage.setItem(KEY, id); } catch (e) {}
        if (window.console) console.info('Google reviews: Place ID =', id);
        return id;
      });
  }

  function load() {
    window.__ombeeGReviews = function () {
      google.maps.importLibrary('places').then(function (lib) {
        return resolveId(lib).then(function (id) {
        var place = new lib.Place({ id: id, requestedLanguage: 'he' });
        return place.fetchFields({ fields: ['displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI'] })
          .then(function () { render(place); });
        });
      }).catch(function (e) { if (window.console) console.warn('Google reviews:', e); });
    };
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(API_KEY) +
            '&v=weekly&loading=async&language=he&callback=__ombeeGReviews';
    s.async = true;
    document.head.appendChild(s);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); load(); }
    }, { rootMargin: '600px 0px' });
    io.observe(root);
  } else {
    load();
  }
})();
