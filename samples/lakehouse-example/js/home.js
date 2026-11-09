/* Home: (1) the fly-in. 96 frames rendered offline from a real three.js 3D scene (water, dock, path, house, door, rooms)
   with a moving camera, drawn on a canvas and scrubbed by GSAP ScrollTrigger. Frames load lazily after the page has painted.
   (2) "One day at the lake": a sun arc and sky scrubbed by scroll. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  if (!root.classList.contains('js') || root.classList.contains('rm') || !window.gsap || !window.ScrollTrigger) {
    var rp = d.getElementById('ripple-anim'); if (rp) rp.parentNode.removeChild(rp);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var $ = function (s) { return d.querySelector(s); };
  function sm(a, b, x) { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); }

  /* ---------- fly-in ---------- */
  var intro = $('.intro'), stage = $('.stage'), cv = d.getElementById('seq');
  if (intro && cv) {
    var ctx = cv.getContext('2d', { alpha: false });
    var prog = $('.prog'), act = $('.hero-act'), sub = $('.hero-sub'), ttl = $('.ttl'), ref = $('.ttl-ref'), cue = $('.cue'), glow = $('.glow'), bar = $('.loadbar');
    var caps = [].slice.call(d.querySelectorAll('.cap'));
    var N = 96, START = 1, portrait = innerWidth / innerHeight < .9 || (navigator.connection && navigator.connection.saveData);
    var dir = portrait ? 'frames/p/' : 'frames/', imgs = new Array(N), cur = START, shown = -1, loaded = 0, W = 0, Hh = 0;
    function size() {
      var dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = Math.min(Math.round(stage.clientWidth * dpr), 1600); Hh = Math.round(W * stage.clientHeight / stage.clientWidth);
      cv.width = W; cv.height = Hh; shown = -1; draw(cur);
    }
    function ready(im) { return im && im.complete && im.naturalWidth; }
    function nearest(i) { if (ready(imgs[i])) return imgs[i]; for (var k = 1; k < N; k++) { if (ready(imgs[i - k])) return imgs[i - k]; if (ready(imgs[i + k])) return imgs[i + k]; } return null; }
    function draw(i) {
      var im = nearest(i); if (!im) return;
      if (shown === i && im === imgs[i]) return; shown = i;
      var r = Math.max(W / im.naturalWidth, Hh / im.naturalHeight), w = im.naturalWidth * r, h = im.naturalHeight * r;
      ctx.drawImage(im, (W - w) / 2, (Hh - h) / 2, w, h);
      if (!cv.classList.contains('on')) cv.classList.add('on');
    }
    function load(i) { return new Promise(function (res) { var im = new Image(); im.decoding = 'async'; im.onload = function () { imgs[i] = im; loaded++; if (bar) bar.style.width = (loaded / N * 100) + '%'; res(); }; im.onerror = function () { res(); }; im.src = dir + 'f' + ('00' + i).slice(-3) + '.webp'; }); }
    function queue() {
      var order = [], seen = {};
      [8, 4, 2, 1].forEach(function (s) { for (var i = START; i < N; i += s) if (!seen[i]) { seen[i] = 1; order.push(i); } });
      var n = 0, run = 0;
      (function pump() { while (run < 5 && n < order.length) { run++; load(order[n++]).then(function () { run--; if (loaded >= N - 1 && bar) bar.style.opacity = 0; pump(); draw(cur); }); } })();
    }
    // caption windows: [fade in start, fully in, fade out start, gone]
    var WN = [[.10, .15, .22, .27], [.28, .33, .41, .46], [.47, .52, .60, .65], [.66, .71, .79, .84], [.88, .93, 2, 3]];
    function render(p) {
      cur = Math.round(START + p * (N - 1 - START)); draw(cur);
      prog.style.setProperty('--p', p.toFixed(4));
      var f = sm(.02, .09, p);
      ttl.style.opacity = 1 - f; ttl.style.transform = 'translateY(calc(-100% - ' + (f * 60) + 'px))';
      ref.style.opacity = (1 - f) * .38; ref.style.transform = 'scaleY(-1) translateY(' + (-f * 60) + 'px)';
      var fa = 1 - sm(.08, .14, p); sub.style.opacity = fa; cue.style.opacity = fa;
      act.style.opacity = 1 - sm(.10, .15, p); act.style.pointerEvents = p > .13 ? 'none' : '';
      glow.style.opacity = (sm(.62, .85, p) * .55).toFixed(3);
      caps.forEach(function (c, i) {
        var w = WN[i], o = sm(w[0], w[1], p) * (1 - sm(w[2], w[3], p));
        c.style.opacity = o; c.style.transform = 'translateY(' + ((1 - o) * 26) + 'px)'; c.style.visibility = o < .01 ? 'hidden' : 'visible'; c.style.pointerEvents = o > .5 ? 'auto' : 'none';
      });
    }
    var st = { p: 0 };
    size(); render(0);
    gsap.to(st, { p: 1, ease: 'none', onUpdate: function () { render(st.p); }, scrollTrigger: { trigger: intro, start: 'top top', end: 'bottom bottom', scrub: .45 } });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); ScrollTrigger.refresh(); render(st.p); }, 150); });
    // ripple filter only runs while the title is on screen
    ScrollTrigger.create({ trigger: intro, start: 'top top', end: '+=' + Math.round(innerHeight * .4), onToggle: function (s) { ref.style.filter = s.isActive ? 'url(#ripple)' : 'none'; } });
    var go = function () { setTimeout(queue, 250); };
    if (d.readyState === 'complete') go(); else addEventListener('load', go);
  }

  /* ---------- one day at the lake ---------- */
  var day = $('.day');
  if (day) {
    var sky = day.querySelector('.st'), sun = day.querySelector('#sun'), moon = day.querySelector('#moon'), arc = day.querySelector('#arc'), win = day.querySelector('#winglow'), star = day.querySelector('#stars');
    var clock = day.querySelector('.t'), say = day.querySelector('#say'), stg = day.querySelector('#stg');
    var K = [ // p, top, bottom
      [0, [38, 48, 86], [226, 150, 118]], [.28, [86, 130, 196], [196, 222, 240]], [.62, [52, 50, 98], [232, 134, 106]], [.82, [14, 20, 44], [40, 46, 82]], [1, [5, 8, 16], [14, 22, 40]]];
    var TXT = [[0, 'Coffee on the dock. Mist lifting off the water, one loon, no one else.'], [.3, 'Swim off the end of the dock, then sit in the sun with wet hair.'], [.58, 'Fire in the woodstove. Dinner for five at the long table.'], [.84, 'Lantern on the dock. Quiet enough to hear the water.']];
    function mix(a, b, t) { return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }); }
    function rgb(c) { return 'rgb(' + c.join(',') + ')'; }
    var plen = arc.getTotalLength();
    function frame(p) {
      var i = 0; while (i < K.length - 2 && p > K[i + 1][0]) i++;
      var t = (p - K[i][0]) / (K[i + 1][0] - K[i][0]); t = Math.min(1, Math.max(0, t));
      sky.style.setProperty('--sky1', rgb(mix(K[i][1], K[i + 1][1], t))); sky.style.setProperty('--sky2', rgb(mix(K[i][2], K[i + 1][2], t)));
      var q = Math.min(1, p / .78), pt = arc.getPointAtLength(plen * q); sun.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      sun.style.opacity = 1 - sm(.74, .82, p);
      moon.style.opacity = sm(.8, .95, p); star.style.opacity = sm(.78, 1, p);
      win.style.opacity = (.25 + .75 * sm(.55, .8, p)).toFixed(2);
      var mins = 400 + Math.round(p * (21 * 60 + 45 - 400)); var h = Math.floor(mins / 60), m = mins % 60; clock.textContent = ((h + 11) % 12 + 1) + ':' + ('0' + m).slice(-2) + (h >= 12 ? ' pm' : ' am');
      var s = TXT[0][1]; TXT.forEach(function (x) { if (p >= x[0]) s = x[1]; }); if (say.textContent !== s) say.textContent = s;
    }
    var ds = { p: 0 }; frame(0);
    gsap.to(ds, { p: 1, ease: 'none', onUpdate: function () { frame(ds.p); }, scrollTrigger: { trigger: day, start: 'top top', end: 'bottom bottom', scrub: .4 } });
  }
})();
