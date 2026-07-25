/* ══════════════════════════════════════════════════════
   OMBee Chat Assistant — עוזר שירות חכם
   רץ כולו בדפדפן, בלי שרת ובלי עלויות.
   עונה על שאלות נפוצות ומעביר לוואטסאפ/טופס כשצריך.
   ══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WHATSAPP = 'https://wa.me/9720523777468';
  var PHONE_DISPLAY = '052-377-7468';
  var PHONE_LINK = 'tel:0523777468';
  var EMAIL = 'helloombee@gmail.com';

  /* ── עיצוב ── */
  var css = ''
  + '.obee-chat-btn{position:fixed;bottom:16px;right:16px;width:56px;height:56px;border-radius:50%;background:#015CFD;color:#fff;border:none;cursor:pointer;z-index:9990;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(1,92,253,.4);transition:all .3s cubic-bezier(.4,0,.2,1)}'
  + '.obee-chat-btn:hover{background:#0141E7;transform:translateY(-3px);box-shadow:0 14px 36px rgba(1,92,253,.5)}'
  + '.obee-chat-btn svg{transition:transform .3s}'
  + '.obee-chat-btn.open svg{transform:rotate(90deg)}'
  + '.obee-chat-hint{position:fixed;bottom:28px;right:84px;background:#fff;color:#00164D;font-size:13px;font-weight:600;padding:10px 16px;border-radius:14px 14px 4px 14px;box-shadow:0 8px 28px rgba(0,22,77,.16);z-index:9990;opacity:0;transform:translateY(6px);transition:all .4s;pointer-events:none;white-space:nowrap}'
  + '.obee-chat-hint.show{opacity:1;transform:none}'
  + '.obee-chat-panel{position:fixed;bottom:84px;right:16px;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);max-height:calc(100dvh - 120px);background:#fff;border-radius:20px;box-shadow:0 24px 64px rgba(0,22,77,.25);z-index:9991;display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:all .3s cubic-bezier(.4,0,.2,1);direction:rtl;font-family:Heebo,sans-serif}'
  + '.obee-chat-panel.open{opacity:1;transform:none;pointer-events:all}'
  + '.obee-chat-head{background:linear-gradient(135deg,#015CFD,#0141E7);color:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}'
  + '.obee-chat-avatar{width:40px;height:40px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}'
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
  + '.obee-chip{background:#fff;color:#015CFD;border:1.5px solid rgba(1,92,253,.35);border-radius:20px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:Heebo,sans-serif;transition:all .2s}'
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
      chips: ['מה השירותים שלכם?', 'כמה זה עולה?', 'תיק עבודות', 'דברו איתי']
    },
    {
      keys: ['לוגו', 'מיתוג', 'עיצוב גרפי', 'שפה מותגית', 'כרטיס ביקור', 'branding'],
      reply: 'בשמחה! ב-OMBee מעצבים לוגו וזהות מותגית מלאה — מהקונספט ועד קבצים מוכנים לשימוש.<ul><li>עיצוב לוגו — החל מ-₪590</li><li>מיתוג מלא — החל מ-₪1,290</li><li>חבילת פרימיום — החל מ-₪2,290</li></ul>כל הפרטים בעמוד <a href="graphic-design.html">עיצוב גרפי ומיתוג</a>.',
      chips: ['תהליך העבודה', 'תיק עבודות', 'דברו איתי']
    },
    {
      keys: ['שיפוץ', 'לשפץ', 'רענון', 'לרענן', 'לשדרג את האתר', 'אתר ישן', 'עיצוב מחדש', 'redesign'],
      reply: 'שיפוץ אתר זו התמחות שלנו! מחדשים את העיצוב בלי לאבד כלום:<ul><li>כל התוכן והתמונות נשמרים</li><li>ה-SEO לא נפגע — שומרים על כל הכתובות והכותרות</li><li>לוקח בין שבועיים לחודש וחצי, תלוי בגודל האתר</li></ul>עוד פרטים בעמוד <a href="website-redesign.html">שיפוץ אתרים</a>.',
      chips: ['כמה זה עולה?', 'דברו איתי']
    },
    {
      keys: ['אתר', 'אתרים', 'דף נחיתה', 'וורדפרס', 'בניית', 'website'],
      reply: 'בונים אתרי תדמית מעוצבים אישית, מותאמים למובייל ולקידום בגוגל:<ul><li>אתר בסיסי — החל מ-₪1,290</li><li>אתר מקצועי — החל מ-₪2,490</li></ul>אפשר לראות הכל בעמוד <a href="website-design.html">בניית אתרים</a>. יש לכם כבר אתר שרוצים לרענן? יש גם <a href="website-redesign.html">שיפוץ אתרים</a>.',
      chips: ['שיפוץ אתר קיים', 'תיק עבודות', 'דברו איתי']
    },
    {
      keys: ['אפליקציה', 'אפליקציות', 'ממשק', 'ui', 'ux', 'app'],
      reply: 'מעצבים ממשקי אפליקציה (UI/UX) — מסכים נקיים, זרימות חכמות וחוויית משתמש שמניעה לפעולה. דוגמאות ופרטים בעמוד <a href="app-design.html">עיצוב אפליקציות</a>.',
      chips: ['תיק עבודות', 'כמה זה עולה?', 'דברו איתי']
    },
    {
      keys: ['פייסבוק', 'אינסטגרם', 'רשתות', 'מדיה חברתית', 'סושיאל', 'פוסטים'],
      reply: 'יש גם שירות עיצוב לפייסבוק ואינסטגרם — החל מ-₪690. מתאים למי שרוצה נוכחות מקצועית ועקבית ברשתות. פרטים בעמוד <a href="website-design.html">השירותים</a>, או פשוט דברו עם עמרי.',
      chips: ['דברו איתי', 'מה עוד אתם עושים?']
    },
    {
      keys: ['כמה זמן', 'לוקח', 'מתי יהיה מוכן', 'זמן אספקה', 'לוחות זמנים', 'דדליין'],
      reply: 'משך העבודה תלוי בהיקף הפרויקט. לדוגמה, שיפוץ אתר לוקח בין שבועיים לחודש וחצי (אתרים קטנים עד 5 עמודים — כ-2-3 שבועות). לפרויקט שלכם עמרי ייתן הערכה מדויקת בשיחה קצרה.',
      chips: ['דברו איתי', 'כמה זה עולה?']
    },
    {
      keys: ['מחיר', 'עולה', 'עלות', 'תקציב', 'כמה', 'תעריף', 'הצעת מחיר'],
      reply: 'הנה מחירי הפתיחה שלנו:<ul><li>עיצוב לוגו — החל מ-₪590</li><li>מיתוג מלא — החל מ-₪1,290</li><li>אתר בסיסי — החל מ-₪1,290</li><li>אתר מקצועי — החל מ-₪2,490</li><li>עיצוב לרשתות חברתיות — החל מ-₪690</li></ul>המחיר המדויק נקבע לפי היקף הפרויקט — שיחה קצרה עם עמרי ותקבלו הצעה מסודרת.',
      chips: ['דברו איתי', 'מה כלול בשירות?']
    },
    {
      keys: ['תהליך', 'איך עובדים', 'איך זה עובד', 'שלבים', 'איך מתחילים'],
      reply: 'ככה זה עובד:<ul><li>שיחת היכרות קצרה — מבינים מה צריך</li><li>הצעת מחיר מסודרת</li><li>עיצוב ראשוני + סבבי תיקונים</li><li>מסירה של קבצים מוכנים לשימוש</li></ul>פשוט, שקוף ובלי הפתעות. רוצים להתחיל?',
      chips: ['דברו איתי', 'כמה זה עולה?']
    },
    {
      keys: ['עבודות', 'דוגמאות', 'תיק', 'פרויקטים', 'פורטפוליו', 'לקוחות', 'המלצות'],
      reply: 'מוזמנים להתרשם! יש לנו <a href="portfolio.html">תיק עבודות</a> עם פרויקטים בלוגו, מיתוג, אתרים ואפליקציות, וגם עמוד <a href="clients.html">לקוחות והמלצות</a> עם חוות דעת אמיתיות.',
      chips: ['מה השירותים שלכם?', 'דברו איתי']
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
      keys: ['וואטסאפ', 'ווצאפ', 'טלפון', 'מייל', 'אימייל', 'ליצור קשר', 'יצירת קשר', 'יוצרים קשר', 'צור קשר', 'קשר', 'לדבר', 'נציג', 'בנאדם', 'אנושי', 'דברו איתי', 'whatsapp'],
      reply: CONTACT_HTML,
      chips: ['מה השירותים שלכם?', 'כמה זה עולה?']
    },
    {
      keys: ['תודה', 'מעולה', 'אחלה', 'סבבה', 'מגניב', 'תותח'],
      reply: 'בשמחה! 😊 אם יש עוד משהו — אני כאן. ואם בא לכם להתקדם, עמרי במרחק הודעת וואטסאפ.',
      chips: ['דברו איתי']
    },
    {
      keys: ['ביי', 'להתראות', 'יום טוב', 'שיהיה'],
      reply: 'להתראות! 👋 מוזמנים לחזור מתי שרוצים. יום נהדר!',
      chips: []
    },
    {
      keys: ['שירותים', 'מה אתם עושים', 'מה אתה עושה', 'פתרונות', 'מה יש'],
      reply: 'אלה הפתרונות שלנו:<ul><li><a href="graphic-design.html">עיצוב גרפי ומיתוג</a> — לוגו וזהות מותגית</li><li><a href="website-design.html">בניית אתרים</a> — אתרי תדמית מעוצבים</li><li><a href="website-redesign.html">שיפוץ אתרים</a> — רענון לאתר קיים</li><li><a href="app-design.html">עיצוב אפליקציות</a> — UI/UX</li><li>עיצוב לפייסבוק ואינסטגרם</li></ul>על מה תרצו לשמוע עוד?',
      chips: ['כמה זה עולה?', 'תיק עבודות', 'דברו איתי']
    }
  ];

  var FALLBACK = {
    reply: 'לא בטוח שהבנתי 🤔 אפשר לנסח אחרת, לבחור נושא מהכפתורים, או פשוט לדבר ישירות עם עמרי בוואטסאפ — הוא עונה מהר!',
    chips: ['מה השירותים שלכם?', 'כמה זה עולה?', 'דברו איתי']
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
    btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>';

    var hint = document.createElement('div');
    hint.className = 'obee-chat-hint';
    hint.textContent = 'יש שאלה? אני כאן 👋';

    var panel = document.createElement('div');
    panel.className = 'obee-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'צ\'אט שירות של OMBee');
    panel.innerHTML = ''
      + '<div class="obee-chat-head">'
      + '<div class="obee-chat-avatar"><img src="images/icon-ombee-logo.png" alt=""/></div>'
      + '<div><div class="obee-chat-title">העוזר של OMBee</div><div class="obee-chat-status">זמין עכשיו</div></div>'
      + '<button class="obee-chat-close" aria-label="סגירת הצ\'אט">✕</button>'
      + '</div>'
      + '<div class="obee-chat-body" aria-live="polite"></div>'
      + '<div class="obee-chat-foot">'
      + '<input class="obee-chat-input" type="text" placeholder="כתבו הודעה..." aria-label="הודעה לעוזר"/>'
      + '<button class="obee-chat-send" aria-label="שליחה"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>'
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
            addChips(['מה השירותים שלכם?', 'כמה זה עולה?', 'תיק עבודות', 'דברו איתי']);
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
      var h = (banner && banner.offsetParent !== null) ? banner.offsetHeight : 0;
      btn.style.bottom = h ? (h + 12) + 'px' : '';
      hint.style.bottom = h ? (h + 24) + 'px' : '';
      panel.style.bottom = h ? (h + 80) + 'px' : '';
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
