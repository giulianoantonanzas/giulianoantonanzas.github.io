(function () {
  var root = document.documentElement;
  var meta = {
    es: {
      title: 'Giuliano Antonanzas',
      description: 'Giuliano Antonanzas: Tech Lead en Crombie, constructor de productos en AWS y director de la Escuelita. Santa Fe, Argentina.',
      langBtn: 'EN', langLabel: 'Switch to English', themeLabel: 'Cambiar tema'
    },
    en: {
      title: 'Giuliano Antonanzas',
      description: 'Giuliano Antonanzas: Tech Lead at Crombie, builder of products on AWS and director of Escuelita. Santa Fe, Argentina.',
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

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Reveal on scroll.
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window) || reduced) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        ro.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    reveals.forEach(function (el) { ro.observe(el); });
    // Anything already in view (hero) shows at once.
    requestAnimationFrame(function () {
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
      });
    });
  }

  // ---- Counters.
  var nums = Array.prototype.slice.call(document.querySelectorAll('.num[data-count]'));
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    if (reduced || !isFinite(target)) { el.textContent = String(target); return; }
    var start = performance.now(), dur = 900;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && nums.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        animateCount(e.target);
        co.unobserve(e.target);
      });
    }, { threshold: .5 });
    nums.forEach(function (n) { co.observe(n); });
  }

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

  // ---- Horizontal rail: drag to scroll with the mouse, wheel scrolls sideways.
  var rail = document.querySelector('.rail-wrap');
  if (rail) {
    var down = false, startX = 0, startLeft = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; startX = e.clientX; startLeft = rail.scrollLeft; rail.style.cursor = 'grabbing';
    });
    window.addEventListener('pointerup', function () { down = false; rail.style.cursor = ''; });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      rail.scrollLeft = startLeft - (e.clientX - startX);
    });
    rail.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var atStart = rail.scrollLeft <= 0 && e.deltaY < 0;
      var atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
