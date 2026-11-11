/* Collar City Tech Help: shared motion layer (site refresh, Case 17). Vanilla, no libraries, self-hosted.
   Works beside site.js (GSAP/Lenis headline + section fades): this file never touches what site.js animates.
   Reduced motion: theme toggle and static helpers only. No JS: every page is complete. */
(function () {
  'use strict';
  var d = document, de = d.documentElement;
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

  /* theme: choice remembered (the inline head snippet applies it before first paint) */
  var tb = $('.theme-btn');
  function isDark() { var t = de.getAttribute('data-theme'); return t ? t === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches; }
  function sync() { if (tb) tb.setAttribute('aria-pressed', isDark() ? 'true' : 'false'); }
  if (tb) {
    sync();
    tb.addEventListener('click', function () {
      var n = isDark() ? 'light' : 'dark';
      de.setAttribute('data-theme', n);
      try { localStorage.setItem('cct-theme', n); } catch (e) {}
      sync();
    });
  }
  addEventListener('storage', function (e) {
    if (e.key === 'cct-theme' && (e.newValue === 'dark' || e.newValue === 'light')) { de.setAttribute('data-theme', e.newValue); sync(); }
  });

  /* wide tables: fade edge on phones while there is more to scroll */
  $$('.tablewrap').forEach(function (w) {
    function u() { w.classList.toggle('rf-edge', w.scrollWidth > w.clientWidth + 4 && w.scrollLeft + w.clientWidth < w.scrollWidth - 4); }
    u(); w.addEventListener('scroll', u, { passive: true }); addEventListener('resize', u);
  });

  de.classList.add('rf-ready');
  if (rm || !('IntersectionObserver' in window)) { de.classList.add('rf-fail'); return; }

  /* one observer for everything: reveal once, and toggle .rf-live for looping effects only while on screen */
  var once = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target; t.classList.add('rf-in'); once.unobserve(t);
      if (t._rf) t._rf();
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
  var live = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('rf-live', e.isIntersecting); });
  }, { threshold: 0.2 });
  function below(el) { return el.getBoundingClientRect().top > innerHeight * 0.92; }
  function seq(list) { list.forEach(function (el, i) { el.style.setProperty('--i', Math.min(i, 8)); }); }

  /* quiet rise for long-form pages (blocks already on screen are never hidden) */
  var rise = $$('.prose > h2, .prose > h3, .prose > p, .prose > ul, .prose > ol, .prose > .tablewrap, .prose > .cta, .prose > .sample, .prose > .faq, .formcard > *, .prose .cards li, .prose .list > li, .sample, .optin');
  var last = null, n = 0;
  rise.forEach(function (el) {
    if (el.closest('.faq') && el.closest('.faq') !== el) return;
    var p = el.parentNode; if (p !== last) { last = p; n = 0; }
    if (below(el)) { el.style.setProperty('--i', Math.min(n++, 6)); el.classList.add('rf-r'); once.observe(el); }
  });

  /* hairlines on list rows, section highlighter, rings and lists: reveal once when seen */
  $$('.svc, .row').forEach(function (el, i) { el.style.setProperty('--i', i % 4); once.observe(el); });
  $$('mark.rf-mark, .rf-posts, .rf-map, table.rf-tbl').forEach(function (el) {
    if (el.matches('.rf-posts')) seq($$('i', el));
    if (el.matches('.rf-map')) seq($$('.rf-t', el));
    once.observe(el);
  });
  $$('.steps').forEach(function (s) { seq($$('.step', s)); live.observe(s); });
  $$('.tier.hl').forEach(function (t) { live.observe(t); });

  /* count-up: real prices only, the full number is in the HTML and sets its own width first */
  $$('[data-rf-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-rf-count')); if (isNaN(end)) return;
    el.style.minWidth = el.offsetWidth + 'px'; el.style.textAlign = 'left';
    el._rf = function () {
      var t0 = null, dur = 1100;
      function f(t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * e); if (p < 1) requestAnimationFrame(f); else el.textContent = end; }
      el.textContent = '0'; requestAnimationFrame(f);
    };
    once.observe(el);
  });

  /* scramble: one status line decodes into place; screen readers keep the real text */
  $$('[data-rf-scramble]').forEach(function (el) {
    var txt = el.textContent, chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    el.style.minWidth = el.offsetWidth + 'px'; el.style.textAlign = 'left';
    var sr = d.createElement('span'); sr.className = 'sr-only'; sr.textContent = txt;
    var vis = d.createElement('span'); vis.setAttribute('aria-hidden', 'true'); vis.textContent = txt;
    el.textContent = ''; el.appendChild(sr); el.appendChild(vis);
    el._rf = function () {
      var t0 = null, dur = 950;
      function f(t) {
        if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur), k = Math.floor(p * txt.length), s = '';
        for (var i = 0; i < txt.length; i++) s += (i < k || txt[i] === ' ' || /[:+]/.test(txt[i])) ? txt[i] : chars[Math.floor(Math.random() * chars.length)];
        vis.textContent = s; if (p < 1) requestAnimationFrame(f); else vis.textContent = txt;
      }
      requestAnimationFrame(f);
    };
    once.observe(el);
  });

  /* progress bar on long reading pages (drawn by CSS scroll timeline where supported) */
  if ($('.prose') && !$('form') && d.documentElement.scrollHeight > innerHeight * 3) {
    var pb = d.createElement('div'); pb.className = 'rf-progress'; pb.setAttribute('aria-hidden', 'true'); d.body.appendChild(pb);
  }

  /* pointer devices: spot light follows the pointer on cards, the main button leans toward it */
  if (fine) {
    $$('.tier, .cards li').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
    var mb = $('.hero .btn.big') || $('main .ctas .btn.big') || $('main .formcard .btn.big') || $('main .center .btn');
    if (mb) {
      var tx = 0, ty = 0, cx = 0, cy = 0, run = false;
      var tick = function () {
        cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
        mb.style.transform = 'translate(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px)';
        if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) requestAnimationFrame(tick); else { run = false; if (!tx && !ty) mb.style.transform = ''; }
      };
      addEventListener('pointermove', function (e) {
        var r = mb.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var near = Math.abs(dx) < r.width / 2 + 60 && Math.abs(dy) < r.height / 2 + 50;
        tx = near ? Math.max(-8, Math.min(8, dx * 0.2)) : 0; ty = near ? Math.max(-6, Math.min(6, dy * 0.25)) : 0;
        if (!run) { run = true; requestAnimationFrame(tick); }
      }, { passive: true });
    }
  }
})();
