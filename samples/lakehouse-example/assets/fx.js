/* CCTH motion layer (original code, no third-party code). One file, two personalities via html[data-fx].
   Transform and opacity only. Off or instant under reduced motion. Pointer effects only where hover:hover and pointer:fine.
   If this file fails to load, every page works exactly as before. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, RM = root.classList.contains('rm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(hover: hover) and (pointer: fine)').matches, MODE = root.getAttribute('data-fx') || 'workshop';
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; }, clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var SAVE = !!(navigator.connection && navigator.connection.saveData);
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); if (e.target._fxIn) e.target._fxIn(); } }); }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }) : null;
  function watch(el, cb) { if (!io || RM) { el.classList.add('in'); if (cb) cb(); return; } el._fxIn = cb; io.observe(el); }

  /* ---------- 1. headline lines (plain-text h2 only; ones already built from .mask lines are left alone) ---------- */
  function lines() {
    var hs = $$('main h2').filter(function (h) { return !h.querySelector('*') && !h.classList.contains('rv') ? true : (!h.querySelector('*') && h.classList.contains('rv')); });
    hs.forEach(function (h) { h.classList.remove('rv'); });
    if (RM || !io) return;
    var run = function () {
      hs.forEach(function (h) {
        var text = h.getAttribute('data-fx-t') || h.textContent.trim().replace(/\s+/g, ' '); h.setAttribute('data-fx-t', text); h.setAttribute('aria-label', text);
        h.innerHTML = text.split(' ').map(function (w) { return '<span class="fxw">' + w + '</span>'; }).join(' ');
        var ws = $$('.fxw', h), L = [], top = null;
        ws.forEach(function (w) { var t = w.offsetTop; if (t !== top) { L.push([]); top = t; } L[L.length - 1].push(w.textContent); });
        h.innerHTML = L.map(function (l, i) { return '<span class="fxl" aria-hidden="true"><span style="--i:' + i + '">' + l.join(' ') + '</span></span>'; }).join('');
        if (!h.classList.contains('fx-lines')) { h.classList.add('fx-lines'); watch(h); }
      });
    };
    (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(run);
    var w0 = innerWidth, t; addEventListener('resize', function () { if (innerWidth === w0) return; w0 = innerWidth; clearTimeout(t); t = setTimeout(run, 200); }, { passive: true });
  }

  /* ---------- 2. count-ups (real numbers stay in the HTML; sample prices only) ---------- */
  function counts() {
    if (RM || !io) return;
    var els = $$('.rg,.price,[data-count-range]');
    els.forEach(function (el) {
      var tn = el.firstChild; if (!tn || tn.nodeType !== 3) { tn = null; for (var k = 0; k < el.childNodes.length; k++) { if (el.childNodes[k].nodeType === 3 && /\$\d/.test(el.childNodes[k].nodeValue)) { tn = el.childNodes[k]; break; } } } if (!tn) return;
      var orig = tn.nodeValue; if (!/\$\d/.test(orig)) return; var full = el.textContent;
      var nums = (orig.match(/\d[\d,]*/g) || []).map(function (n) { return +n.replace(/,/g, ''); });
      el.setAttribute('aria-label', full);
      var o = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; o.disconnect();
        var w = el.getBoundingClientRect().width; el.style.display = el.style.display || 'inline-block'; el.style.minWidth = w + 'px'; el.style.fontVariantNumeric = 'tabular-nums';
        var t0 = performance.now(), dur = 1100;
        (function f(t) { var p = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4), i = 0;
          tn.nodeValue = p >= 1 ? orig : orig.replace(/\d[\d,]*/g, function () { var v = Math.round(nums[i++] * e); return v.toLocaleString('en-US'); });
          if (p < 1) requestAnimationFrame(f); else { el.style.minWidth = ''; } })(t0);
      }, { threshold: 0.7 });
      tn.nodeValue = orig.replace(/\d[\d,]*/g, '0'); o.observe(el);
    });
    var hb = d.querySelector('.hero-note b'); /* hero price on the lake site */
    if (hb && /\$\d/.test(hb.textContent)) { var og = hb.textContent, n = +og.replace(/\D/g, ''), t0 = performance.now() + 900; hb.style.fontVariantNumeric = 'tabular-nums'; (function f(t) { var p = clamp((t - t0) / 900, 0, 1); hb.textContent = '$' + Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); else hb.textContent = og; })(t0 - 900); }
  }

  /* ---------- 3. clip-path reveals ---------- */
  function clips() {
    var sel = MODE === 'workshop' ? '.two>*,.ba-frame,.car-stage,.estb .slip-wrap,.shopt figure,.cta-band' : '.seas-stage,.mosaic button,.split figure,.sec.paper figure,.about-fig';
    $$(sel).forEach(function (el) { if (el.closest('.story,.rs,.stage')) return; el.classList.add('fx-clip'); watch(el); });
  }

  /* ---------- 4. hairlines that draw in ---------- */
  function hairs() {
    $$('main .sec').forEach(function (s, i) { if (i === 0 && s.previousElementSibling === null) return; if (parseFloat(getComputedStyle(s).paddingTop) < 28) return; s.classList.add('fx-host'); var h = d.createElement('i'); h.className = 'fx-hair'; h.setAttribute('aria-hidden', 'true'); s.insertBefore(h, s.firstChild); watch(h); });
  }

  /* ---------- 5. layered parallax (Bay Nine hero: footage, text column, bay board at three speeds) ---------- */
  function parallax() {
    var hero = d.querySelector('.hero'), hv = hero && hero.querySelector('.hv'); if (!hv || RM || innerWidth < 900) return;
    var col = hero.querySelector('.hero-col'), board = hero.querySelector('.bbw'), vis = true, y = 0, ty = 0, raf = 0;
    root.classList.add('fx-par');
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) kick(); }).observe(hero);
    function frame() { raf = 0; y = lerp(y, ty, 0.14); var p = Math.abs(ty - y) < 0.2 ? ty : y;
      hv.style.setProperty('--py', clamp(p * 0.08, 0, 56).toFixed(1) + 'px'); if (col) col.style.setProperty('--pt', (-clamp(p * 0.05, 0, 40)).toFixed(1) + 'px');
      if (board) board.style.transform = 'translate3d(0,' + (-clamp(p * 0.025, 0, 20)).toFixed(1) + 'px,0)';
      if (p !== ty) raf = requestAnimationFrame(frame); }
    function kick() { ty = scrollY; if (!raf && vis) raf = requestAnimationFrame(frame); }
    addEventListener('scroll', kick, { passive: true }); kick();
  }

  /* ---------- 6. magnetic buttons, cursor glow, card tilt with sheen (desktop pointer only) ---------- */
  function pointerFx() {
    if (!FINE || RM) return;
    $$('.hero-act .btn,.cta-band .btn,.bar-r .btn,.btn.lg,.stage .btn,.rs-foot .btn').forEach(function (el) {
      if (el.closest('.dock')) return;
      var s = el.closest('.bar-r') ? 0.18 : 0.28, x = 0, y = 0, tx = 0, ty = 0, raf = 0;
      function f() { raf = 0; x = lerp(x, tx, 0.2); y = lerp(y, ty, 0.2); el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
        if (Math.abs(x - tx) + Math.abs(y - ty) > 0.05) raf = requestAnimationFrame(f); else if (!tx && !ty) el.style.transform = ''; }
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); tx = (e.clientX - r.left - r.width / 2) * s; ty = (e.clientY - r.top - r.height / 2) * s; if (!raf) raf = requestAnimationFrame(f); });
      el.addEventListener('pointerleave', function () { tx = ty = 0; if (!raf) raf = requestAnimationFrame(f); });
    });
    var g = d.createElement('div'); g.className = 'fx-glow'; g.setAttribute('aria-hidden', 'true'); d.body.appendChild(g);
    var gx = 0, gy = 0, gtx = 0, gty = 0, graf = 0, first = true;
    function gf() { graf = 0; gx = lerp(gx, gtx, 0.12); gy = lerp(gy, gty, 0.12); g.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)'; if (Math.abs(gx - gtx) + Math.abs(gy - gty) > 0.4) graf = requestAnimationFrame(gf); }
    addEventListener('pointermove', function (e) { gtx = e.clientX; gty = e.clientY; if (first) { first = false; gx = gtx; gy = gty; g.classList.add('on'); } if (!graf) graf = requestAnimationFrame(gf); }, { passive: true });
    d.documentElement.addEventListener('pointerleave', function () { g.classList.remove('on'); first = true; });
    var TILT = '.stile,.tix a,.drive li,.fleet-card,.svc-card,.mosaic button,.rs-room .rs-fig';
    var cur = null, traf = 0, tp = null;
    function tf() { traf = 0; if (!cur || !tp) return; var r = cur.getBoundingClientRect(), px = clamp((tp.x - r.left) / r.width, 0, 1), py = clamp((tp.y - r.top) / r.height, 0, 1);
      cur.style.setProperty('--mx', (px * 100).toFixed(1) + '%'); cur.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      cur.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 5).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 5).toFixed(2) + 'deg)'; }
    function leave() { if (!cur) return; var c = cur; c.style.transition = 'transform .6s cubic-bezier(.2,.7,.1,1)'; c.style.transform = ''; setTimeout(function () { if (c !== cur) c.style.transition = ''; }, 650); cur = null; }
    d.addEventListener('pointermove', function (e) {
      var t = e.target.closest ? e.target.closest(TILT) : null; if (t && t.closest('.rs,.stage')) t = null;
      if (t && t.classList.contains('rv') && !t.classList.contains('in')) t = null;
      if (t !== cur) { leave(); if (t) { cur = t; t.classList.add('fx-tilt'); if (!t.querySelector(':scope>.fx-sheen')) { var s = d.createElement('i'); s.className = 'fx-sheen'; s.setAttribute('aria-hidden', 'true'); if (getComputedStyle(t).position === 'static') t.style.position = 'relative'; t.appendChild(s); } t.style.transition = 'transform .25s cubic-bezier(.2,.7,.1,1)'; } }
      if (cur) { tp = { x: e.clientX, y: e.clientY }; if (!traf) traf = requestAnimationFrame(tf); } }, { passive: true });
    d.addEventListener('pointerleave', leave, true);
  }

  /* ---------- 7. icons drawn for the business ---------- */
  var IC = {
    workshop: {
      oil: '<path d="M4 17h12l3-6h-4l-2-4H8l-1 3H4z"/><path d="M19 11l2 3"/><path d="M12 20c-1.2 0-2-.8-2-1.8 0-1 2-3.2 2-3.2s2 2.2 2 3.2c0 1-.8 1.8-2 1.8z" transform="translate(5 -3) scale(.7)"/>',
      tires: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2"/><path d="M12 3v5.8M12 15.2V21M3 12h5.8M15.2 12H21"/>',
      alignment: '<path d="M6 4v16M18 4v16"/><path d="M6 12h12"/><path d="M9 9l-3 3 3 3M15 9l3 3-3 3"/>',
      brakes: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="6.2" r=".8"/><circle cx="17.2" cy="15" r=".8"/><circle cx="6.8" cy="15" r=".8"/><path d="M19 7a9 9 0 0 1 0 10" stroke-width="3"/>',
      suspension: '<path d="M8 3h8M12 3v3"/><path d="M8 6c4 1.3 4 2.6 0 3.9s-4 2.6 0 3.9 4 2.6 0 3.9"/><path d="M12 18v3"/>',
      engine: '<path d="M4 9h3l2-2h6l2 2h3v7h-3l-2 2H9l-2-2H4z"/><path d="M12 9V6M10 6h4"/>',
      battery: '<rect x="3" y="7" width="18" height="12" rx="1.5"/><path d="M7 7V5h3v2M14 7V5h3v2"/><path d="M8 13h4M10 11v4M15 13h2"/>',
      ac: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.5 4.5L12 6.5l2.5-2M9.5 19.5L12 17.5l2.5 2"/>',
      inspection: '<rect x="5" y="4" width="14" height="17" rx="1.5"/><path d="M9 4V2.5h6V4"/><path d="M8.5 11l1.7 1.7 3.3-3.4M8.5 17h7"/>'
    },
    lakeside: {
      summer: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
      fall: '<path d="M12 21V11"/><path d="M12 3c4 2 7 5 6 9-3 0-5-1-6-2-1 1-3 2-6 2-1-4 2-7 6-9z"/><path d="M12 15l3-2"/>',
      winter: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
      dawn: '<path d="M3 17h18M6 17a6 6 0 0 1 12 0"/><path d="M12 6v3M5.5 9l1.8 1.8M18.5 9l-1.8 1.8"/>',
      day: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21"/>',
      dusk: '<path d="M3 18h18M7 18a5 5 0 0 1 10 0"/><path d="M12 9v2M4.5 12.5l1.4 1.4M19.5 12.5l-1.4 1.4"/>',
      night: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'
    }
  };
  function icons() {
    var set = IC[MODE] || {};
    if (MODE === 'workshop') {
      $$('.stile').forEach(function (a) { var k = (a.getAttribute('href') || '').split('#')[1], p = set[k]; if (!p || a.querySelector('.fx-ico')) return;
        var s = d.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'fx-ico'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = p; a.insertBefore(s, a.firstChild); if (a.classList.contains('rv') && !RM) { var o = new MutationObserver(function () { if (a.classList.contains('in')) { s.classList.add('in'); o.disconnect(); } }); o.observe(a, { attributes: true, attributeFilter: ['class'] }); } else s.classList.add('in'); });
    } else {
      $$('.seas-tabs button,.tod-b button').forEach(function (b) { var k = b.getAttribute('data-s') || b.getAttribute('data-tod'), p = set[k]; if (!p || b.querySelector('.fx-ico-i')) return;
        var s = d.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'fx-ico-i'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = p; b.insertBefore(s, b.firstChild); });
    }
  }

  /* ---------- 8. page-to-page image morph (View Transitions; plain navigation where unsupported) ---------- */
  function morph() {
    $$('a[data-morph]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (RM) return; var cands = $$(a.getAttribute('data-morph')); if (!cands.length) return;
        var best = null, bv = 0; cands.forEach(function (c) { var r = c.getBoundingClientRect(), w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)), h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)); if (w * h > bv) { bv = w * h; best = c; } });
        if (best && bv > 8000) best.classList.add('fx-morph-t');
      });
    });
    addEventListener('pageshow', function () { $$('.fx-morph-t').forEach(function (e) { if (!e.hasAttribute('data-fx-target')) e.classList.remove('fx-morph-t'); }); });
  }

  /* ---------- 9. grain ---------- */
  function grain() { if (RM) return; var g = d.createElement('div'); g.className = 'fx-grain'; g.setAttribute('aria-hidden', 'true'); d.body.appendChild(g); }

  function init() { try { lines(); counts(); clips(); hairs(); parallax(); pointerFx(); icons(); morph(); grain(); } catch (e) { /* every page still works without these effects */ } }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
