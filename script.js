(function () {
  var root = document.documentElement;
  var meta = {
    es: {
      title: 'Giuliano Antonanzas',
      description: 'Giuliano Antonanzas: Tech Lead y desarrollador full stack, especialista en IA aplicada y AWS. Lidera equipos, construye productos y enseña a programar.',
      langBtn: 'EN', langLabel: 'Switch to English', themeLabel: 'Cambiar tema'
    },
    en: {
      title: 'Giuliano Antonanzas',
      description: 'Giuliano Antonanzas: Tech Lead and full stack developer, applied AI and AWS specialist. Leads teams, builds products and teaches people to code.',
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
    drawGraph();
  }

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

  // ---- Git graph: draw the lane lines and branch/merge curves between commit dots.
  var graph = document.getElementById('graph');
  var svgNS = 'http://www.w3.org/2000/svg';
  function drawGraph() {
    if (!graph) return;
    var old = graph.querySelector('svg.lines');
    if (old) old.remove();
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'lines');
    svg.setAttribute('aria-hidden', 'true');
    var box = graph.getBoundingClientRect();
    var commits = Array.prototype.slice.call(graph.querySelectorAll('.commit'));
    var colors = { 0: 'var(--l0)', 1: 'var(--l1)', 2: 'var(--l2)' };
    function center(c) {
      var d = c.querySelector('.dot').getBoundingClientRect();
      return { x: d.left + d.width / 2 - box.left, y: d.top + d.height / 2 - box.top };
    }
    function path(d, color, dashed) {
      var p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('stroke', color);
      if (dashed) p.setAttribute('stroke-dasharray', '4 5');
      svg.appendChild(p);
    }
    var last = {};
    commits.forEach(function (c) {
      var lane = c.dataset.lane, pt = center(c);
      if (last[lane]) path('M' + last[lane].x + ' ' + last[lane].y + ' L' + pt.x + ' ' + pt.y, colors[lane]);
      if (c.dataset.from) {
        var from = document.getElementById(c.dataset.from);
        if (from) {
          var f = center(from), midY = (f.y + pt.y) / 2;
          path('M' + f.x + ' ' + f.y + ' C' + f.x + ' ' + midY + ', ' + pt.x + ' ' + midY + ', ' + pt.x + ' ' + pt.y, colors[lane]);
        }
      }
      if (c.dataset.merge) {
        var m = document.getElementById(c.dataset.merge);
        if (m) {
          var s = center(m), my = (s.y + pt.y) / 2;
          path('M' + s.x + ' ' + s.y + ' C' + s.x + ' ' + my + ', ' + pt.x + ' ' + my + ', ' + pt.x + ' ' + pt.y, colors[m.dataset.lane], true);
        }
      }
      last[lane] = pt;
    });
    // Open branches keep running to the bottom of the graph.
    Object.keys(last).forEach(function (lane) {
      if (lane === '0') return;
      path('M' + last[lane].x + ' ' + last[lane].y + ' L' + last[lane].x + ' ' + box.height, colors[lane], true);
    });
    graph.insertBefore(svg, graph.firstChild);
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

  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawGraph, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawGraph);
  window.addEventListener('load', drawGraph);

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

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
