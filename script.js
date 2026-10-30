(function () {
  var root = document.documentElement;
  var meta = {
    es: {
      title: 'Giuliano Antonanzas — Tech Lead · Full Stack · AWS',
      description: 'Giuliano Antonanzas, Tech Lead y desarrollador full stack de Santa Fe, Argentina. AWS Certified. Lidero equipos y construyo productos serverless con TypeScript, React y Node.',
      langBtn: 'EN', langLabel: 'Switch to English', themeLabel: 'Cambiar tema'
    },
    en: {
      title: 'Giuliano Antonanzas — Tech Lead · Full Stack · AWS',
      description: 'Giuliano Antonanzas, Tech Lead and full stack developer from Santa Fe, Argentina. AWS Certified. I lead teams and build serverless products with TypeScript, React and Node.',
      langBtn: 'ES', langLabel: 'Cambiar a español', themeLabel: 'Toggle theme'
    }
  };

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } }

  // ---- Language: ES by default; EN if the browser isn't in Spanish; remembered after a toggle.
  function setLang(lang) {
    root.lang = lang;
    root.dataset.lang = lang;
    document.title = meta[lang].title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', meta[lang].description);
    var lb = document.getElementById('lang-toggle');
    if (lb) { lb.textContent = meta[lang].langBtn; lb.setAttribute('aria-label', meta[lang].langLabel); }
    var tb = document.getElementById('theme-toggle');
    if (tb) tb.setAttribute('aria-label', meta[lang].themeLabel);
  }
  var saved = read('lang');
  var fromQuery = /[?&]lang=(es|en)\b/.exec(location.search);
  var initial = fromQuery ? fromQuery[1]
    : saved || ((navigator.language || 'es').toLowerCase().indexOf('es') === 0 ? 'es' : 'en');
  setLang(initial);
  document.getElementById('lang-toggle').addEventListener('click', function () {
    var next = root.dataset.lang === 'en' ? 'es' : 'en';
    setLang(next);
    save('lang', next);
  });

  // ---- Theme: follows the system unless the visitor picked one.
  var savedTheme = read('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var current = root.dataset.theme || (systemDark ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    save('theme', next);
  });

  // ---- Highlight the section in view.
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav nav a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
