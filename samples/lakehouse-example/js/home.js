/* Home. (1) Hero: real footage of the lake at dusk, poster first, then the loop (WebM then MP4, 960 wide on phones and slow links;
   poster only under reduced motion or Save-Data). (2) Time of day: dawn / day / dusk / night grade, tinted layers that cross-fade.
   (3) The walk in: one scrubbed GSAP timeline cross-fades and pushes in through four real photographs (lake, cottage and dock,
   boathouse, living room). Only transform and opacity move. Images are fetched after the page has loaded and decoded before they show.
   Real footage and photographs only (Pexels, see assets/CREDITS.md). */
(function () {
  'use strict';
  var d = document, root = d.documentElement, RM = root.classList.contains('rm');
  var $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var stage = $('.stage'); if (!stage) return;

  /* ---------- hero loop ---------- */
  var hv = $('.s0', stage), v = $('video', hv), poster = $('img.m', hv);
  var con = navigator.connection || {}, SD = !!con.saveData, started = false;
  function play() { var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stays */ }); }
  if (v && !RM && !SD && window.HTMLVideoElement) {
    var small = innerWidth <= 900 || /(^|-)(2g|3g)$/.test(con.effectiveType || ''), base = v.getAttribute('data-src');
    var attach = function () {
      if (started) return; started = true;
      var w = small ? '960' : '1920';
      [['webm', 'video/webm; codecs="vp9"'], ['mp4', 'video/mp4']].forEach(function (t) { var s = d.createElement('source'); s.src = base + '-' + w + '.' + t[0]; s.type = t[1]; v.appendChild(s); });
      v.load(); v.addEventListener('playing', function () { v.classList.add('on'); }, { once: true }); play();
    };
    var go = function () { setTimeout(attach, 150); };
    (poster && poster.decode ? poster.decode().catch(function () {}) : Promise.resolve()).then(function () { if (d.readyState === 'complete') go(); else addEventListener('load', go, { once: true }); });
    d.addEventListener('visibilitychange', function () { if (!started) return; if (d.hidden) v.pause(); else if (!stage.hasAttribute('data-away')) play(); });
  }

  /* ---------- time of day ---------- */
  var SAY = {
    dawn: 'Coffee on the dock. Mist lifting off the water, one loon, no one else.',
    day: 'Swim off the end of the dock, then sit in the sun with wet hair.',
    dusk: 'Fire in the woodstove. Dinner for five at the long table.',
    night: 'Lantern on the dock. Quiet enough to hear the water.'
  };
  var say = $('#todsay'), tbs = $$('.tod-b button');
  tbs.forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-tod'); stage.setAttribute('data-tod', k);
      tbs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      if (say) say.textContent = SAY[k];
    });
  });

  /* ---------- season switcher: real photographs cross-fade, text swaps. Instant under reduced motion. ---------- */
  var seas = $('#seas');
  if (seas) {
    var SE = {
      summer: ['Summer on the dock', 'Swim before breakfast, paddle at dawn, eat outside until the mosquitoes win. July fills first, so book early.', '$290', 'stay.html#calendar', 'Pick dates'],
      fall: ['Fall color', 'Maples turn the far shore red and the stove is lit by 5 pm. The quiet weekends go quickly in October.', '$270', 'fall-foliage-weekend-cabin.html', 'Read more'],
      winter: ['Winter woodstove', 'Snow on the dock, a house that stays warm, and a long afternoon with a book by the stove.', '$240', 'winter-woodstove-getaway.html', 'Read more']
    };
    var figs = $$('figure', seas), sb = $$('.seas-tabs button', seas), txt = $('.seas-txt', seas), busy = null;
    var setS = function (k) {
      var fg = figs.filter(function (f) { return f.getAttribute('data-s') === k; })[0]; if (!fg || fg.classList.contains('on')) return;
      sb.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-s') === k ? 'true' : 'false'); });
      var im = $('img', fg), ready = im && im.decode ? im.decode().catch(function () {}) : Promise.resolve();
      ready.then(function () {
        figs.forEach(function (f) { f.classList.toggle('on', f === fg); });
        var put = function () { var x = SE[k]; $('#seas-h').textContent = x[0]; $('#seas-p').textContent = x[1]; $('#seas-r b').textContent = x[2]; var a = $('#seas-a'); a.href = x[3]; a.textContent = x[4]; txt.classList.remove('swap'); };
        if (RM) put(); else { txt.classList.add('swap'); clearTimeout(busy); busy = setTimeout(put, 330); }
      });
    };
    sb.forEach(function (b) { b.addEventListener('click', function () { setS(b.getAttribute('data-s')); }); });
  }


  /* ---------- rooms: pinned room-by-room story. Photos cross-fade and drift, captions slide in beside them. ---------- */
  var rs = $('#rooms');
  if (rs && !RM && window.gsap && window.ScrollTrigger && root.classList.contains('js')) {
    gsap.registerPlugin(ScrollTrigger);
    var rooms = $$('.rs-room', rs), rn = $('#rs-n'), N = rooms.length, last = 0;
    rs.classList.add('rs-on');
    // the rooms are stacked, so lazy loading would wait; fetch and decode them all once the section is near
    var warm = function () { $$('img', rs).forEach(function (im) { im.loading = 'eager'; if (im.decode) im.decode().catch(function () {}); }); };
    if ('IntersectionObserver' in window) { var wio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { wio.disconnect(); warm(); } }, { rootMargin: '1600px 0px' }); wio.observe(rs); } else warm();
    var figs2 = rooms.map(function (r) { return $('.rs-fig', r); }), txts = rooms.map(function (r) { return $('.rs-txt', r); });
    gsap.set(figs2.slice(1), { opacity: 0, x: 40, scale: 1.04 });
    gsap.set(txts.slice(1), { opacity: 0, x: 70 });
    var rt = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: rs, start: 'top top', end: 'bottom bottom', scrub: 0.7,
      onUpdate: function (self) { var i = Math.min(N - 1, Math.floor(self.progress * N + 0.001)); if (i !== last) { last = i; rn.textContent = '0' + (i + 1); } } } });
    rt.set({}, {}, N);
    for (var i = 1; i < N; i++) {
      rt.to(txts[i - 1], { opacity: 0, x: -50, duration: 0.25, ease: 'power2.in' }, i - 0.35)
        .to(figs2[i - 1], { opacity: 0, x: -40, duration: 0.3, ease: 'power2.inOut' }, i - 0.2)
        .to(figs2[i], { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: 'power2.out' }, i - 0.05)
        .to(txts[i], { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, i + 0.12);
    }
  }

  /* ---------- the walk in ---------- */
  if (RM || !window.gsap || !window.ScrollTrigger || !root.classList.contains('js')) return;
  gsap.registerPlugin(ScrollTrigger);
  var intro = $('#intro'), shots = $$('.shot', stage), caps = $$('.cap', stage), wrap = $('.hero-wrap'), tod = $('.tod'), cue = $('.cue'), prog = $('.prog');
  var pending = $$('img[data-src]', stage);
  function fetchShots() {
    pending.forEach(function (im) {
      var src = im.getAttribute('data-src'), pre = new Image(); pre.decoding = 'async';
      pre.onload = function () { (pre.decode ? pre.decode() : Promise.resolve()).catch(function () {}).then(function () { im.src = src; }); };
      pre.src = src;
    });
  }
  var later = function () { setTimeout(fetchShots, 900); };
  if (d.readyState === 'complete') later(); else addEventListener('load', later, { once: true });

  var s = shots, ease = 'power2.inOut', ST;
  gsap.set(caps, { autoAlpha: 0, y: 24 });
  var tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
    trigger: intro, start: 'top top', end: 'bottom bottom', scrub: 0.8,
    onUpdate: function (self) {
      prog.style.setProperty('--p', self.progress.toFixed(4));
      var away = self.progress > 0.34;
      if (away !== stage.hasAttribute('data-away')) { if (away) { stage.setAttribute('data-away', ''); if (v && started) v.pause(); } else { stage.removeAttribute('data-away'); if (v && started && !d.hidden) play(); } }
    } } });
  tl.fromTo(wrap, { opacity: 1, y: 0 }, { opacity: 0, y: -36, duration: 0.9 }, 0)
    .to([tod, cue], { opacity: 0, duration: 0.7 }, 0)
    .to(s[0], { scale: 1.2, duration: 3.6 }, 0)
    .to(s[0], { opacity: 0, duration: 1.2, ease: ease }, 2.6)
    .fromTo(s[1], { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1.02, duration: 1.2, ease: ease }, 2.6)
    .to(s[1], { scale: 1.16, duration: 3.2 }, 3.8)
    .to(s[1], { opacity: 0, duration: 1.2, ease: ease }, 5.4)
    .fromTo(s[2], { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1.02, duration: 1.2, ease: ease }, 5.4)
    .to(s[2], { scale: 1.16, duration: 3.1 }, 6.6)
    .to(s[2], { opacity: 0, duration: 1.2, ease: ease }, 7.9)
    .fromTo(s[3], { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1.0, duration: 1.2, ease: ease }, 7.9)
    .to(s[3], { scale: 1.07, duration: 1.1 }, 9.1)
    .to(caps[0], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.9).to(caps[0], { autoAlpha: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 2.3)
    .to(caps[1], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.9).to(caps[1], { autoAlpha: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 5.1)
    .to(caps[2], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 6.6).to(caps[2], { autoAlpha: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 7.7)
    .to(caps[3], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 9.0)
    .set({}, {}, 10);
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { ScrollTrigger.refresh(); }, 150); });
})();
