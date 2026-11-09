/* Home: scroll-driven fly-in. 96 pre-rendered frames of a real 3D scene (camera path through the bay and around the car)
   drawn on a canvas. Sticky stage + GSAP ScrollTrigger scrub. Frames load lazily after the page is painted. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  if (!root.classList.contains('js') || root.classList.contains('rm') || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var intro = d.querySelector('.intro'), stage = d.querySelector('.stage'), cv = d.getElementById('seq'), ctx = cv.getContext('2d'),
      prog = d.querySelector('.prog'), hero = d.querySelector('.hero-copy'), act = d.querySelector('.hero-act'), meta = d.querySelector('.hero-meta'),
      h1 = d.querySelector('.hero-copy h1'), caps = [].slice.call(d.querySelectorAll('.cap'));
  var N = 96, START = 5, portrait = innerWidth / innerHeight < .9 || (navigator.connection && navigator.connection.saveData);
  var dir = portrait ? 'frames/p/' : 'frames/', imgs = new Array(N), ok = [], cur = START, shown = -1;
  var W = 0, Hh = 0;

  function size() {
    var dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = Math.min(Math.round(stage.clientWidth * dpr), 1600); Hh = Math.round(W * stage.clientHeight / stage.clientWidth);
    cv.width = W; cv.height = Hh; shown = -1; draw(cur);
  }
  function nearest(i) { if (imgs[i] && imgs[i].complete && imgs[i].naturalWidth) return imgs[i]; for (var k = 1; k < N; k++) { var a = imgs[i - k], b = imgs[i + k]; if (a && a.complete && a.naturalWidth) return a; if (b && b.complete && b.naturalWidth) return b; } return null; }
  function draw(i) {
    var im = nearest(i); if (!im) return;
    if (shown === i && im === imgs[i]) return; shown = i;
    var r = Math.max(W / im.naturalWidth, Hh / im.naturalHeight), w = im.naturalWidth * r, h = im.naturalHeight * r;
    ctx.drawImage(im, (W - w) / 2, (Hh - h) / 2, w, h);
    if (!cv.classList.contains('on')) cv.classList.add('on');
  }
  function load(i) { return new Promise(function (res) { var im = new Image(); im.decoding = 'async'; im.onload = im.onerror = function () { res(); }; im.src = dir + 'f' + String(i).padStart(3, '0') + '.webp'; imgs[i] = im; }); }
  function queue() {
    var order = [], seen = {};
    [8, 4, 2, 1].forEach(function (s) { for (var i = START; i < N; i += s) if (!seen[i]) { seen[i] = 1; order.push(i); } });
    var n = 0, run = 0;
    (function pump() { while (run < 5 && n < order.length) { run++; load(order[n++]).then(function () { run--; pump(); draw(cur); }); } })();
  }
  function sm(a, b, x) { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); }

  // caption windows [fade-in start, fully in, start fade-out, gone]
  var W_ = [[.12, .17, .24, .29], [.30, .35, .43, .48], [.50, .55, .64, .69], [.70, .75, .82, .86], [.89, .93, 2, 3]];
  function render(p) {
    cur = Math.round(START + p * (N - 1 - START)); draw(cur);
    prog.style.setProperty('--p', p.toFixed(4));
    var f = sm(.03, .12, p);
    hero.style.opacity = 1 - f; hero.style.transform = 'translateY(' + (-f * 60) + 'px)';
    h1.style.fontVariationSettings = '"wdth" ' + Math.round(125 - 50 * sm(0, .12, p));
    var fa = 1 - sm(.1, .15, p); act.style.opacity = fa; act.style.pointerEvents = fa < .2 ? 'none' : ''; meta.style.opacity = fa;
    caps.forEach(function (c, i) {
      var w = W_[i], o = sm(w[0], w[1], p) * (1 - sm(w[2], w[3], p));
      c.style.opacity = o; c.style.transform = 'translateY(' + ((1 - o) * 26) + 'px)'; c.style.visibility = o < .01 ? 'hidden' : 'visible';
      c.style.pointerEvents = o > .5 ? 'auto' : 'none';
    });
  }
  var st = { p: 0 };
  size(); render(0);
  gsap.to(st, { p: 1, ease: 'none', onUpdate: function () { render(st.p); },
    scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom bottom', scrub: .45 } });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); ScrollTrigger.refresh(); render(st.p); }, 150); });
  // start frames only after the page has painted and loaded
  function go() { setTimeout(queue, 250); }
  if (d.readyState === 'complete') go(); else addEventListener('load', go);
})();
