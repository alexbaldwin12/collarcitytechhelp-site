/* Showpiece preview: poster first, then a short looping preview drawn from the showpiece's own fly-in frames
   (same files, loaded by path, nothing copied). Frames load only when the card is half on screen, or on hover / touch.
   Skipped for reduced motion. With Save-Data, waits for hover or touch. No libraries. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saver = navigator.connection && navigator.connection.saveData;
  if (reduce || !('IntersectionObserver' in window)) return;
  var phone = matchMedia('(max-width:640px)').matches;
  document.querySelectorAll('.sc-card[data-frames]').forEach(function (card) {
    var stage = card.querySelector('.sc-stage'), cv = card.querySelector('canvas'); if (!stage || !cv) return;
    var base = card.getAttribute('data-frames'), N = +card.getAttribute('data-n') || 96, stride = phone ? 6 : 4;
    var startFrame = +card.getAttribute('data-start') || 0, dir = phone ? base + 'p/' : base;
    var ctx = cv.getContext('2d'), imgs = [], idxs = [], loading = false, started = false, vis = false, raf = 0, last = 0, pos = 0, dirn = 1, scrub = null;
    for (var i = 0; i < N; i += stride) idxs.push(i);
    var startPos = Math.round(startFrame / stride);
    function name(n) { return dir + 'f' + ('000' + n).slice(-3) + '.webp'; }
    function load() {
      if (loading) return; loading = true;
      // coarse first (every other sampled frame), then the gaps
      var order = []; for (var k = 0; k < idxs.length; k += 2) order.push(k); for (k = 1; k < idxs.length; k += 2) order.push(k);
      var q = order.slice(), active = 0;
      (function pump() {
        while (active < 3 && q.length) { (function (k) { active++; var im = new Image(); im.decoding = 'async';
          im.onload = function () { imgs[k] = im; if (!cv.width) { cv.width = im.naturalWidth; cv.height = im.naturalHeight; } active--; ready(); pump(); };
          im.onerror = function () { active--; pump(); }; im.src = name(idxs[k]); })(q.shift()); }
      })();
    }
    function have() { var a = []; for (var k = 0; k < idxs.length; k++) if (imgs[k]) a.push(k); return a; }
    function ready() { if (!started && have().length >= 6) { started = true; pos = startPos; stage.classList.add('live'); if (vis) play(); else draw(); } }
    function draw() {
      var h = have(); if (!h.length) return;
      var p = Math.max(0, Math.min(idxs.length - 1, pos)), a = h[0], b = h[h.length - 1], k;
      var lo = null, hi = null; for (k = 0; k < h.length; k++) { if (h[k] <= p) lo = h[k]; if (h[k] >= p && hi === null) hi = h[k]; }
      if (lo === null) lo = hi; if (hi === null) hi = lo;
      ctx.globalAlpha = 1; ctx.drawImage(imgs[lo], 0, 0, cv.width, cv.height);
      if (hi !== lo) { ctx.globalAlpha = (p - lo) / (hi - lo); ctx.drawImage(imgs[hi], 0, 0, cv.width, cv.height); ctx.globalAlpha = 1; }
    }
    function tick(t) {
      raf = 0; if (!vis || document.hidden) return;
      var dt = Math.min(.1, (t - last) / 1000 || 0); last = t;
      if (scrub === null) { var n = idxs.length - 1; pos += dirn * dt * 1.6; if (pos >= n) { pos = n; dirn = -1; } if (pos <= 0) { pos = 0; dirn = 1; } }
      draw(); raf = requestAnimationFrame(tick);
    }
    function play() { if (!raf && started) { last = performance.now(); raf = requestAnimationFrame(tick); } }
    new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting; if (vis && !saver) load(); if (vis) play();
    }, { threshold: .5 }).observe(stage);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) play(); });
    ['pointerenter', 'touchstart', 'focusin'].forEach(function (ev) { card.addEventListener(ev, load, { passive: true }); });
    stage.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !started) return;
      var r = stage.getBoundingClientRect(); scrub = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      pos = scrub * (idxs.length - 1); draw();
    });
    stage.addEventListener('pointerleave', function () { scrub = null; last = performance.now(); });
  });
})();
