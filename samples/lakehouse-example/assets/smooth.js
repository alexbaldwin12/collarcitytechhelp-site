/* smooth.js - shared smooth-scroll module (identical file in both showpiece sites).
   Needs, in this order: vendor/gsap.min.js, vendor/ScrollTrigger.min.js, vendor/lenis.min.js, then this file.
   Lenis 1.3.27 (MIT) drives the page scroll; GSAP's ticker feeds it; ScrollTrigger reads every Lenis tick.
   OFF (native scrolling, nothing loaded into the scroll path) when:
     - the visitor prefers reduced motion (also switches off live if they change the setting),
     - the device is touch-first (hover:none + pointer:coarse): native momentum scrolling is better there,
     - Lenis or GSAP failed to load, or ?nosmooth is in the URL (for A/B checks).
   API: window.CCSmooth = { on, lenis, stop(), start(), scrollTo(target, opts) }. Safe to call when off.
   Only the scroll position is touched. No network, no storage, no eval. */
(function () {
  'use strict';
  var w = window, d = document, html = d.documentElement;
  var state = { on: false, lenis: null };
  var rm = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var touch = w.matchMedia ? w.matchMedia('(hover: none) and (pointer: coarse)') : { matches: false };
  var tick = null, style = null;

  function api() {
    return {
      get on() { return state.on; },
      get lenis() { return state.lenis; },
      stop: function () { if (state.lenis) state.lenis.stop(); },
      start: function () { if (state.lenis) state.lenis.start(); },
      scrollTo: function (target, opts) {
        opts = opts || {};
        if (state.lenis) { state.lenis.scrollTo(target, opts); return; }
        var y = typeof target === 'number' ? target :
          (typeof target === 'string' ? d.querySelector(target) : target);
        if (y && y.getBoundingClientRect) y = y.getBoundingClientRect().top + w.pageYOffset + (opts.offset || 0);
        w.scrollTo(0, y || 0);
      }
    };
  }
  w.CCSmooth = api();

  function canRun() {
    if (rm.matches || touch.matches) return false;
    if (/[?&]nosmooth\b/.test(w.location.search)) return false;
    return typeof w.Lenis === 'function' && w.gsap && w.ScrollTrigger;
  }

  function start() {
    if (state.on || !canRun()) return;
    w.gsap.registerPlugin(w.ScrollTrigger);
    var l = new w.Lenis({
      lerp: 0.1,             /* calm, short glide; 1 = instant */
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,      /* never touch-hijack */
      anchors: true          /* in-page #links glide too */
    });
    state.lenis = l; state.on = true;
    /* minimal rules Lenis needs (same as its lenis.css, injected so pages need no extra link) */
    style = d.createElement('style');
    style.textContent = 'html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}' +
      '.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-stopped{overflow:clip}' +
      '.lenis.lenis-smooth iframe{pointer-events:none}';
    d.head.appendChild(style);
    l.on('scroll', w.ScrollTrigger.update);
    tick = function (t) { l.raf(t * 1000); };
    w.gsap.ticker.add(tick);
    w.gsap.ticker.lagSmoothing(0);
    html.classList.add('cc-smooth');
  }

  function stop() {
    if (!state.on) return;
    if (tick) w.gsap.ticker.remove(tick);
    state.lenis.destroy();
    state.lenis = null; state.on = false; tick = null;
    if (style && style.parentNode) style.parentNode.removeChild(style);
    html.classList.remove('cc-smooth');
    if (w.ScrollTrigger) w.ScrollTrigger.refresh();
  }

  function react() { if (canRun()) start(); else stop(); }
  [rm, touch].forEach(function (m) {
    if (m.addEventListener) m.addEventListener('change', react);
    else if (m.addListener) m.addListener(react);
  });
  start();
})();
