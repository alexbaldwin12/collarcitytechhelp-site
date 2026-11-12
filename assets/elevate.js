/* Collar City Tech Help: site elevate layer (Case 17, part 2). Vanilla, no libraries.
   Hero "homepage assembling" frame, pinned How-it-works story, Troy photo parallax, reveals. Reduced motion: static finished states. No JS: HTML is already the finished state. */
(function () {
  'use strict';
  var d = document, de = d.documentElement;
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  /* positions of the text layers inside each captured sample page (fractions of its width/height) */
  var S = {
    birch: { n: [.043, .02, .635], h: [0, .088, 1], b: [.683, .011, .274] },
    hud: { n: [0, 0, 1], h: [.043, .122, .913], b: [.048, .428, .804] },
    ridge: { n: [0, 0, 1], h: [.066, .462, .73], b: [.071, .776, .39] }
  };
  var ORDER = ['birch', 'hud', 'ridge'], A = '/assets/elevate/f-';
  function site(k, on) {
    var p = S[k], el = d.createElement('div'); el.className = 'hf-site' + (on ? ' is-on' : ''); el.setAttribute('data-site', k);
    function im(c, src, pos) {
      var i = new Image(); i.className = c; i.alt = ''; i.decoding = 'async'; i.src = A + k + '-' + src + '.webp'; i.draggable = false;
      if (pos) i.style.cssText = 'left:' + pos[0] * 100 + '%;top:' + pos[1] * 100 + '%;width:' + pos[2] * 100 + '%';
      el.appendChild(i); return i;
    }
    im('hf-base', 'base'); im('hf-l hf-nav', 'nav', p.n); im('hf-l hf-head', 'head', p.h); im('hf-l hf-btn', 'btn', p.b);
    return el;
  }
  function ready(el) {
    return Promise.all($$('img', el).map(function (i) { return i.decode ? i.decode().catch(function () {}) : Promise.resolve(); }));
  }
  function later(f, ms) { return setTimeout(f, ms); }

  /* ---- hero frame ---- */
  var hf = $('.hframe'), seen = false;
  try { seen = sessionStorage.getItem('cct-hf') === '1'; } catch (e) {}
  if (hf) (function () {
    var view = $('.hf-view', hf), win = $('.hf-win', hf), cur = $('.hf-site', hf), timers = [], stopped = false, paused = false, rounds = 0, idx = 0, inview = true;
    function final() { hf.classList.add('hf-final'); stopped = true; timers.forEach(clearTimeout); }
    if (rm) { hf.classList.add('hf-final'); return; }
    try { sessionStorage.setItem('cct-hf', '1'); } catch (e) {}
    function play(el, fast) {
      var seq = [['s-base', 0], ['s-nav', 380], ['s-head', 760], ['s-btn', 1250]];
      seq.forEach(function (s) { timers.push(later(function () { el.classList.add(s[0]); }, fast ? s[1] * .7 : s[1])); });
    }
    function skip() { timers.forEach(clearTimeout); $$('.hf-site', hf).forEach(function (s) { s.classList.add('s-base', 's-nav', 's-head', 's-btn'); }); hf.classList.add('hf-skip'); stopped = true; win.classList.add('idle'); }
    if (seen) { hf.classList.add('hf-final'); if (!rm) win.classList.add('idle'); return; }
    cur.classList.add('is-on');
    var go = function () { ready(cur).then(function () { later(function () { play(cur); }, 120); }); };
    if (d.readyState !== 'loading') go(); else d.addEventListener('DOMContentLoaded', go);
    /* the other two sites come in after the page has settled; cycle only on wide screens */
    var wide = matchMedia('(min-width:960px)').matches;
    function next() {
      if (stopped || paused || !inview) { timers.push(later(next, 1500)); return; }
      idx = (idx + 1) % ORDER.length; if (idx === 0) rounds++;
      if (rounds >= 2 && idx === 0) { settle(); return; }
      var old = $('.hf-site.is-on', hf), el = $('[data-site="' + ORDER[idx] + '"]', hf); if (!el) return;
      el.classList.remove('s-base', 's-nav', 's-head', 's-btn'); el.classList.add('no-t');
      void el.offsetWidth; el.classList.remove('no-t');
      old.classList.remove('is-on'); el.classList.add('is-on'); play(el, true);
      timers.push(later(next, 7600));
    }
    function settle() { /* end on the first site and stay still */
      var old = $('.hf-site.is-on', hf), el = $('[data-site="birch"]', hf); if (old === el) { stopped = true; return; }
      old.classList.remove('is-on'); el.classList.add('is-on', 's-base', 's-nav', 's-head', 's-btn'); stopped = true;
    }
    if (wide) {
      var ric = window.requestIdleCallback || function (f) { return setTimeout(f, 2500); };
      addEventListener('load', function () {
        ric(function () {
          ORDER.slice(1).forEach(function (k) { var el = site(k); view.appendChild(el); });
          timers.push(later(next, 9000));
        });
      });
    }
    var pb = d.createElement('button'); pb.type = 'button'; pb.className = 'hf-pause'; pb.setAttribute('aria-label', 'Pause animation'); pb.setAttribute('aria-pressed', 'false');
    pb.addEventListener('click', function (e) { e.stopPropagation(); paused = !paused; pb.setAttribute('aria-pressed', paused ? 'true' : 'false'); pb.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation'); });
    hf.appendChild(pb);
    win.addEventListener('click', function () { if (!hf.classList.contains('hf-skip')) skip(); else { paused = !paused; pb.setAttribute('aria-pressed', paused ? 'true' : 'false'); } });
    var sc = function () { if (scrollY > 70) { skip(); removeEventListener('scroll', sc); } };
    addEventListener('scroll', sc, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inview = es[0].isIntersecting; }, { threshold: .15 }).observe(hf);
    timers.push(later(function () { win.classList.add('idle'); }, 4200));
    /* safety: never leave the frame hidden */
    timers.push(later(function () { if (!$('.hf-site .hf-base', hf)) return; }, 6000));
  })();

  /* ---- generic reveals (sections, icons, art) ---- */
  if ('IntersectionObserver' in window && !rm) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('el-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.sec, .ph-web, .ph-sec').forEach(function (el) { io.observe(el); });
    var ringEl = $('.gauge .ring');
    if (ringEl) {
      var C = 2 * Math.PI * 52, off = C * .3; ringEl.style.strokeDashoffset = C;
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { ringEl.style.strokeDashoffset = off; o.disconnect(); } }, { threshold: .4 }).observe(ringEl);
    }
  } else { $$('.sec').forEach(function (s) { s.classList.add('el-in'); }); }

  /* ---- troy photo: slow transform-only parallax ---- */
  var troy = $('.troy img');
  if (troy && !rm && 'IntersectionObserver' in window) {
    var box = troy.parentNode.closest('.troy'), vis = false, tk = false;
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) upd(); }, { rootMargin: '10% 0px' }).observe(box);
    function upd() { tk = false; var r = box.getBoundingClientRect(), p = (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2); p = Math.max(-1, Math.min(1, p)); troy.style.transform = 'translate3d(0,' + (p * -6).toFixed(2) + '%,0)'; }
    addEventListener('scroll', function () { if (vis && !tk) { tk = true; requestAnimationFrame(upd); } }, { passive: true });
  }

  /* ---- how it works ---- */
  $$('.how').forEach(function (sec) {
    var steps = $$('.step', sec); if (!steps.length) return;
    var stageHost = $('.how-stage', sec), pin = $('.how-pin', sec);
    function frame(s) {
      var w = d.createElement('div'); w.className = 'hs hs-frame'; w.setAttribute('aria-hidden', 'true'); w.setAttribute('data-s', s);
      w.innerHTML = '<div class="hf-win"><div class="hf-bar"><i></i><i></i><i></i><span></span></div><div class="hf-view"></div></div><div class="hs-check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>';
      var v = $('.hf-view', w), el = site('ridge', true); v.appendChild(el); return w;
    }
    var tall = innerHeight >= 600;
    if (innerWidth >= 960 && !rm && tall && stageHost && pin) {
      sec.classList.add('pin-on');
      var fr = frame(1); stageHost.appendChild(fr);
      var cur = 0, tk = false;
      function upd() {
        tk = false; var r = pin.getBoundingClientRect(), span = pin.offsetHeight - innerHeight;
        var p = Math.max(0, Math.min(1, -r.top / span)); sec.style.setProperty('--p', p.toFixed(3));
        var i = Math.min(3, Math.floor(p * 4 + .001)); if (p > .995) i = 3;
        if (i !== cur) { cur = i; fr.setAttribute('data-s', i + 1); steps.forEach(function (s, j) { s.classList.toggle('on', j === i); }); }
      }
      steps.forEach(function (s, j) { s.classList.toggle('on', j === 0); });
      upd();
      addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(upd); } }, { passive: true });
      addEventListener('resize', function () { if (innerWidth < 960) location.reload(); });
    } else {
      steps.forEach(function (s, j) { var f = frame(j + 1); f.classList.add('hs-stack'); s.appendChild(f); });
    }
  });
})();
