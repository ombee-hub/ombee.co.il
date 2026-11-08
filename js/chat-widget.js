/* ══════════════════════════════════════════════════════
   OMBee Chat Assistant — עוזר שירות חכם
   רץ כולו בדפדפן, בלי שרת ובלי עלויות.
   עונה על שאלות נפוצות ומעביר לוואטסאפ/טופס כשצריך.
   ══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WHATSAPP = 'https://wa.me/972523777468';
  var PHONE_DISPLAY = '052-377-7468';
  var PHONE_LINK = 'tel:0523777468';
  var EMAIL = 'helloombee@gmail.com';

  /* ── עיצוב ── */
  var css = ''
  + '.obee-chat-btn{position:fixed;bottom:16px;right:16px;width:56px;height:56px;border-radius:50%;background:#015CFD;color:#fff;border:none;cursor:pointer;z-index:10000;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(1,92,253,.4);transition:all .3s cubic-bezier(.4,0,.2,1)}'
  + '.obee-chat-btn:hover{background:#0141E7;transform:translateY(-3px);box-shadow:0 14px 36px rgba(1,92,253,.5)}'
  + '.obee-chat-btn svg,.obee-chat-btn img{transition:transform .3s}.obee-chat-btn img{width:30px;height:30px;object-fit:contain;display:block}'
  + '.obee-chat-btn.open svg,.obee-chat-btn.open img{transform:rotate(90deg)}'
  + '.obee-chat-hint{position:fixed;bottom:28px;right:84px;background:#fff;color:#00164D;font-size:13px;font-weight:600;padding:10px 16px;border-radius:14px 14px 4px 14px;box-shadow:0 8px 28px rgba(0,22,77,.16);z-index:10000;opacity:0;transform:translateY(6px);transition:all .4s;pointer-events:none;white-space:nowrap}'
  + '.obee-chat-hint.show{opacity:1;transform:none}'
  + '.obee-chat-panel{position:fixed;bottom:84px;right:16px;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);max-height:calc(100dvh - 120px);background:#fff;border-radius:20px;box-shadow:0 24px 64px rgba(0,22,77,.25);z-index:10001;display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:all .3s cubic-bezier(.4,0,.2,1);direction:rtl;font-family:Heebo,sans-serif}'
  + '.obee-chat-panel.open{opacity:1;transform:none;pointer-events:all}'
  + '.obee-chat-head{background:linear-gradient(135deg,#015CFD,#0141E7);color:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}'
  + '.obee-chat-avatar{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;flex-shrink:0}'
  + '.obee-chat-avatar img{width:26px;height:26px;object-fit:contain}'
  + '.obee-chat-title{font-size:15px;font-weight:700;line-height:1.2}'
  + '.obee-chat-status{font-size:12px;opacity:.85;display:flex;align-items:center;gap:5px}'
  + '.obee-chat-status::before{content:"";width:7px;height:7px;border-radius:50%;background:#4ADE80;display:inline-block}'
  + '.obee-chat-close{margin-inline-start:auto;background:rgba(255,255,255,.15);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .2s}'
  + '.obee-chat-close:hover{background:rgba(255,255,255,.3)}'
  + '.obee-chat-body{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:10px;background:#F7FAFF}'
  + '.obee-msg{max-width:85%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.55;word-break:break-word;animation:obeeMsgIn .25s ease}'
  + '@keyframes obeeMsgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'
  + '.obee-msg.bot{background:#fff;color:#00164D;align-self:flex-start;border:1px solid rgba(1,92,253,.12);border-radius:16px 16px 16px 4px;box-shadow:0 2px 8px rgba(0,22,77,.05)}'
  + '.obee-msg.user{background:#015CFD;color:#fff;align-self:flex-end;border-radius:16px 16px 4px 16px}'
  + '.obee-msg a{color:#015CFD;font-weight:700;text-decoration:underline}'
  + '.obee-msg.user a{color:#fff}'
  + '.obee-msg ul{margin:6px 0 0;padding-inline-start:18px;list-style:disc}'
  + '.obee-typing{display:flex;gap:4px;padding:12px 16px;background:#fff;border:1px solid rgba(1,92,253,.12);border-radius:16px 16px 16px 4px;align-self:flex-start;width:fit-content}'
  + '.obee-typing span{width:7px;height:7px;border-radius:50%;background:#AEC1E7;animation:obeeTyp 1.1s infinite}'
  + '.obee-typing span:nth-child(2){animation-delay:.15s}.obee-typing span:nth-child(3){animation-delay:.3s}'
  + '@keyframes obeeTyp{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-5px);opacity:1}}'
  + '.obee-chips{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start;animation:obeeMsgIn .25s ease}'
  + '.obee-chip{background:#fff;color:#015CFD;border:1.5px solid rgba(1,92,253,.35);border-radius:8px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:Heebo,sans-serif;transition:all .2s}'
  + '.obee-chip:hover{background:#015CFD;color:#fff;border-color:#015CFD}'
  + '.obee-chat-foot{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(1,92,253,.1);background:#fff;flex-shrink:0}'
  + '.obee-chat-input{flex:1;border:1.5px solid rgba(1,92,253,.2);border-radius:12px;padding:10px 14px;font-size:14px;font-family:Heebo,sans-serif;color:#00164D;outline:none;transition:border .2s}'
  + '.obee-chat-input:focus{border-color:#015CFD}'
  + '.obee-chat-send{background:#015CFD;color:#fff;border:none;width:42px;height:42px;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}'
  + '.obee-chat-send:hover{background:#0141E7}'
  + '@media(max-width:480px){.obee-chat-panel{right:12px;left:12px;width:auto;bottom:78px;height:65vh;height:65dvh;max-height:calc(100dvh - 96px)}.obee-chat-btn{bottom:14px;right:14px}.obee-chat-hint{right:78px;bottom:26px}.obee-chat-input{font-size:16px}}';

  /* ── בסיס ידע ── */
  var CONTACT_HTML = 'אפשר לדבר עם עמרי ישירות:<br/>'
    + '📱 <a href="' + WHATSAPP + '" target="_blank" rel="noopener">שליחת הודעה בוואטסאפ</a><br/>'
    + '📞 <a href="' + PHONE_LINK + '">' + PHONE_DISPLAY + '</a><br/>'
    + '✉️ <a href="mailto:' + EMAIL + '">' + EMAIL + '</a><br/>'
    + 'או דרך <a href="contact.html">טופס יצירת הקשר</a> באתר.';

  var INTENTS = [
    {
      keys: ['שלום', 'היי', 'הי ', 'אהלן', 'בוקר טוב', 'ערב טוב', 'צהריים', 'מה נשמע', 'מה קורה', 'hello', 'hi'],
      reply: 'היי! 👋 אני העוזר של OMBee. אפשר לשאול אותי על השירותים, המחירים, תהליך העבודה או כל דבר אחר — ואם תרצו, אחבר אתכם ישירות לעמרי.',
      chips: ['מה השירותים שלכם?', 'כמה זה עולה?', 'תיק עבודות', 'יצירת קשר']
    },
    {
      keys: ['לוגו', 'מיתוג', 'עיצוב גרפי', 'שפה מותגית', 'כרטיס ביקור', 'branding'],
      reply: 'בשמחה! ב-OMBee מעצבים לוגו וזהות מותגית מלאה — מהקונספט ועד קבצים מוכנים לשימוש.<ul><li>עיצוב לוגו — ₪750</li><li>חבילת מיתוג עסקי — ₪1,650</li><li>פלייר — ₪250 (דו־צדדי ₪400)</li></ul>כל הפרטים בעמוד <a href="graphic-design.html">עיצוב גרפי ומיתוג</a>.',
      chips: ['תהליך העבודה', 'תיק עבודות', 'יצירת קשר']
    },
    {
      keys: ['שיפוץ', 'לשפץ', 'רענון', 'לרענן', 'לשדרג את האתר', 'אתר ישן', 'עיצוב מחדש', 'redesign'],
      reply: 'שיפוץ אתר זו התמחות שלנו! מחדשים את העיצוב בלי לאבד כלום:<ul><li>כל התוכן והתמונות נשמרים</li><li>ה-SEO לא נפגע — שומרים על כל הכתובות והכותרות</li><li>לוקח בין שבועיים לחודש וחצי, תלוי בגודל האתר</li></ul>עוד פרטים בעמוד <a href="website-redesign.html">שיפוץ אתרים</a>.',
      chips: ['כמה זה עולה?', 'יצירת קשר']
    },
    {
      keys: ['אתר', 'אתרים', 'דף נחיתה', 'וורדפרס', 'בניית', 'website'],
      reply: 'בונים אתרי תדמית מעוצבים אישית, מותאמים למובייל ולקידום בגוגל:<ul><li>דף נחיתה — ₪1,500</li><li>אתר תדמית עד 5 עמודים — ₪2,900</li></ul>אפשר לראות הכל בעמוד <a href="website-design.html">בניית אתרים</a>. יש לכם כבר אתר שרוצים לרענן? יש גם <a href="website-redesign.html">שיפוץ אתרים</a>.',
      chips: ['שיפוץ אתר קיים', 'תיק עבודות', 'יצירת קשר']
    },
    {
      keys: ['אפליקציה', 'אפליקציות', 'ממשק', 'ui', 'ux', 'app'],
      reply: 'מעצבים ממשקי אפליקציה (UI/UX) — מסכים נקיים, זרימות חכמות וחוויית משתמש שמניעה לפעולה. דוגמאות ופרטים בעמוד <a href="app-design.html">עיצוב אפליקציות</a>.',
      chips: ['תיק עבודות', 'כמה זה עולה?', 'יצירת קשר']
    },
    {
      keys: ['פייסבוק', 'אינסטגרם', 'רשתות', 'מדיה חברתית', 'סושיאל', 'פוסטים'],
      reply: 'יש גם ניהול רשתות: רשת אחת (פייסבוק או אינסטגרם) — ₪850 לחודש, ושתי הרשתות — ₪1,250 לחודש. מתאים למי שרוצה נוכחות מקצועית ועקבית ברשתות. פרטים בעמוד <a href="website-design.html">השירותים</a>, או פשוט דברו עם עמרי.',
      chips: ['יצירת קשר', 'מה עוד אתם עושים?']
    },
    {
      keys: ['כמה זמן', 'לוקח', 'מתי יהיה מוכן', 'זמן אספקה', 'לוחות זמנים', 'דדליין'],
      reply: 'משך העבודה תלוי בהיקף הפרויקט. לדוגמה, שיפוץ אתר לוקח בין שבועיים לחודש וחצי (אתרים קטנים עד 5 עמודים — כ-2-3 שבועות). לפרויקט שלכם עמרי ייתן הערכה מדויקת בשיחה קצרה.',
      chips: ['יצירת קשר', 'כמה זה עולה?']
    },
    {
      keys: ['מחיר', 'עולה', 'עלות', 'תקציב', 'כמה', 'תעריף', 'הצעת מחיר'],
      reply: 'הנה המחירים שלנו:<ul><li>עיצוב לוגו — ₪750</li><li>חבילת מיתוג עסקי — ₪1,650</li><li>פלייר — ₪250 (דו־צדדי ₪400)</li><li>דף נחיתה — ₪1,500</li><li>אתר תדמית — ₪2,900</li><li>ניהול רשתות — מ-₪850 לחודש</li></ul>המחיר המדויק נקבע לפי היקף הפרויקט — שיחה קצרה עם עמרי ותקבלו הצעה מסודרת.',
      chips: ['יצירת קשר', 'מה כלול בשירות?']
    },
    {
      keys: ['תהליך', 'איך עובדים', 'איך זה עובד', 'שלבים', 'איך מתחילים'],
      reply: 'ככה זה עובד:<ul><li>שיחת היכרות קצרה — מבינים מה צריך</li><li>הצעת מחיר מסודרת</li><li>עיצוב ראשוני + סבבי תיקונים</li><li>מסירה של קבצים מוכנים לשימוש</li></ul>פשוט, שקוף ובלי הפתעות. רוצים להתחיל?',
      chips: ['יצירת קשר', 'כמה זה עולה?']
    },
    {
      keys: ['עבודות', 'דוגמאות', 'תיק', 'פרויקטים', 'פורטפוליו', 'לקוחות', 'המלצות'],
      reply: 'מוזמנים להתרשם! יש לנו <a href="portfolio.html">תיק עבודות</a> עם פרויקטים בלוגו, מיתוג, אתרים ואפליקציות, וגם עמוד <a href="clients.html">לקוחות והמלצות</a> עם חוות דעת אמיתיות.',
      chips: ['מה השירותים שלכם?', 'יצירת קשר']
    },
    {
      keys: ['מי אתם', 'מי אתה', 'עמרי', 'אודות', 'הסטודיו', 'על החברה'],
      reply: 'OMBee הוא הסטודיו של עמרי בן אליהו — מעצב גרפי ומעצב UI/UX. אפשר לקרוא את הסיפור המלא בעמוד <a href="about.html">אודותיי</a>.',
      chips: ['מה השירותים שלכם?', 'תיק עבודות']
    },
    {
      keys: ['נגישות', 'הצהרת נגישות'],
      reply: 'האתר שלנו נגיש! יש כפתור נגישות בפינה השמאלית התחתונה עם התאמות תצוגה, ואפשר לקרוא את <a href="accessibility-statement.html">הצהרת הנגישות</a> המלאה.',
      chips: ['מה השירותים שלכם?']
    },
    {
      keys: ['וואטסאפ', 'ווצאפ', 'טלפון', 'מייל', 'אימייל', 'ליצור קשר', 'יצירת קשר', 'יוצרים קשר', 'צור קשר', 'קשר', 'לדבר', 'נציג', 'בנאדם', 'אנושי', 'יצירת קשר', 'whatsapp'],
      reply: CONTACT_HTML,
      chips: ['מה השירותים שלכם?', 'כמה זה עולה?']
    },
    {
      keys: ['תודה', 'מעולה', 'אחלה', 'סבבה', 'מגניב', 'תותח'],
      reply: 'בשמחה! 😊 אם יש עוד משהו — אני כאן. ואם בא לכם להתקדם, עמרי במרחק הודעת וואטסאפ.',
      chips: ['יצירת קשר']
    },
    {
      keys: ['ביי', 'להתראות', 'יום טוב', 'שיהיה'],
      reply: 'להתראות! 👋 מוזמנים לחזור מתי שרוצים. יום נהדר!',
      chips: []
    },
    {
      keys: ['שירותים', 'מה אתם עושים', 'מה אתה עושה', 'פתרונות', 'מה יש'],
      reply: 'אלה הפתרונות שלנו:<ul><li><a href="graphic-design.html">עיצוב גרפי ומיתוג</a> — לוגו וזהות מותגית</li><li><a href="website-design.html">בניית אתרים</a> — אתרי תדמית מעוצבים</li><li><a href="website-redesign.html">שיפוץ אתרים</a> — רענון לאתר קיים</li><li><a href="app-design.html">עיצוב אפליקציות</a> — UI/UX</li><li>עיצוב לפייסבוק ואינסטגרם</li></ul>על מה תרצו לשמוע עוד?',
      chips: ['כמה זה עולה?', 'תיק עבודות', 'יצירת קשר']
    }
  ];

  var FALLBACK = {
    reply: 'לא בטוח שהבנתי 🤔 אפשר לנסח אחרת, לבחור נושא מהכפתורים, או פשוט לדבר ישירות עם עמרי בוואטסאפ — הוא עונה מהר!',
    chips: ['מה השירותים שלכם?', 'כמה זה עולה?', 'יצירת קשר']
  };

  function matchIntent(text) {
    var t = text.toLowerCase().replace(/[?!.,،؛;:"'״׳()]/g, ' ');
    for (var i = 0; i < INTENTS.length; i++) {
      var keys = INTENTS[i].keys;
      for (var k = 0; k < keys.length; k++) {
        if (t.indexOf(keys[k]) !== -1) return INTENTS[i];
      }
    }
    return FALLBACK;
  }

  /* ── בניית הממשק ── */
  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.className = 'obee-chat-btn';
    btn.setAttribute('aria-label', 'פתיחת צ\'אט שירות');
    var OBEE_WHITE_LOGO = 'data:image/webp;base64,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';
    btn.innerHTML = '<img src="' + OBEE_WHITE_LOGO + '" alt="" width="28" height="28"/>';

    var hint = document.createElement('div');
    hint.className = 'obee-chat-hint';
    hint.textContent = 'יש שאלה? אני כאן 👋';

    var panel = document.createElement('div');
    panel.className = 'obee-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'צ\'אט שירות של OMBee');
    panel.innerHTML = ''
      + '<div class="obee-chat-head">'
      + '<div class="obee-chat-avatar"><img src="' + OBEE_WHITE_LOGO + '" alt=""/></div>'
      + '<div><div class="obee-chat-title">העוזר של OMBee</div><div class="obee-chat-status">זמין עכשיו</div></div>'
      + '<button class="obee-chat-close" aria-label="סגירת הצ\'אט">✕</button>'
      + '</div>'
      + '<div class="obee-chat-body" aria-live="polite"></div>'
      + '<div class="obee-chat-foot">'
      + '<input class="obee-chat-input" type="text" placeholder="כתבו הודעה..." aria-label="הודעה לעוזר"/>'
      + '<button class="obee-chat-send" aria-label="שליחה"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform:scaleX(-1)"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>'
      + '</div>';

    document.body.appendChild(btn);
    document.body.appendChild(hint);
    document.body.appendChild(panel);

    var body = panel.querySelector('.obee-chat-body');
    var input = panel.querySelector('.obee-chat-input');
    var sendBtn = panel.querySelector('.obee-chat-send');
    var closeBtn = panel.querySelector('.obee-chat-close');
    var opened = false;
    var greeted = false;

    /* רמז חד-פעמי אחרי 4 שניות */
    if (!localStorage.getItem('obeeChatHintSeen')) {
      setTimeout(function () {
        if (!opened) {
          hint.classList.add('show');
          setTimeout(function () { hint.classList.remove('show'); }, 5000);
        }
        localStorage.setItem('obeeChatHintSeen', '1');
      }, 4000);
    }

    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function addMsg(html, who) {
      var m = document.createElement('div');
      m.className = 'obee-msg ' + who;
      m.innerHTML = html;
      body.appendChild(m);
      scrollDown();
    }

    function addChips(list) {
      if (!list || !list.length) return;
      var wrap = document.createElement('div');
      wrap.className = 'obee-chips';
      list.forEach(function (label) {
        var c = document.createElement('button');
        c.className = 'obee-chip';
        c.type = 'button';
        c.textContent = label;
        c.addEventListener('click', function () { send(label); });
        wrap.appendChild(c);
      });
      body.appendChild(wrap);
      scrollDown();
    }

    function clearChips() {
      var old = body.querySelectorAll('.obee-chips');
      for (var i = 0; i < old.length; i++) old[i].remove();
    }

    function botReply(text) {
      var intent = matchIntent(text);
      var typing = document.createElement('div');
      typing.className = 'obee-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      scrollDown();
      setTimeout(function () {
        typing.remove();
        addMsg(intent.reply, 'bot');
        addChips(intent.chips);
      }, 500 + Math.random() * 400);
    }

    function send(text) {
      text = (text || input.value).trim();
      if (!text) return;
      clearChips();
      addMsg(text.replace(/</g, '&lt;'), 'user');
      input.value = '';
      botReply(text);
    }

    function toggle(open) {
      opened = open;
      panel.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-label', open ? 'סגירת צ\'אט שירות' : 'פתיחת צ\'אט שירות');
      if (open) {
        hint.classList.remove('show');
        if (!greeted) {
          greeted = true;
          setTimeout(function () {
            addMsg('היי! 👋 אני העוזר של OMBee. איך אפשר לעזור?', 'bot');
            addChips(['מה השירותים שלכם?', 'כמה זה עולה?', 'תיק עבודות', 'יצירת קשר']);
          }, 300);
        }
        setTimeout(function () { input.focus(); }, 350);
      }
    }

    btn.addEventListener('click', function () { toggle(!opened); });
    closeBtn.addEventListener('click', function () { toggle(false); });
    sendBtn.addEventListener('click', function () { send(); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) toggle(false); });

    /* אם באנר הקוקיז מוצג — מרימים את הכפתור מעליו, ומחזירים כשהוא נסגר */
    function liftAboveCookieBanner() {
      var banner = document.querySelector('.ombee-cookie-banner');
      var h = (banner && !banner.classList.contains('hide')) ? banner.offsetHeight : 0;
      var card = window.innerWidth <= 1100;
      /* הכפתור מיושר לגובה שורת הכפתורים של הבאנר בכל רוחב מסך */
      if (h) {
        var act = banner.querySelector('.ombee-cookie-actions');
        btn.style.bottom = Math.round(parseFloat(getComputedStyle(banner).bottom) + banner.offsetHeight - (act.offsetTop + act.offsetHeight / 2) - 28) + 'px';
      } else {
        btn.style.bottom = '';
      }
      hint.style.bottom = h ? (h + (card ? 92 : 16)) + 'px' : '';
      panel.style.bottom = h ? (h + (card ? 92 : 16)) + 'px' : '';
    }
    liftAboveCookieBanner();
    var bannerWatch = new MutationObserver(liftAboveCookieBanner);
    bannerWatch.observe(document.body, { childList: true, subtree: false });
    window.addEventListener('resize', liftAboveCookieBanner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
