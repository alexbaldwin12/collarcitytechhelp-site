/* Home hero: poster first, then the real footage. WebM then MP4 sources (960 wide on phones and slow links, 1920 otherwise).
   No video under reduced motion or Save-Data (the poster stays). The clip pauses when the hero is off screen or the tab is hidden.
   Real footage only (Pexels, see assets/CREDITS.md). */
(function () {
  'use strict';
  var d = document, root = d.documentElement, hv = d.querySelector('.hv'); if (!hv) return;
  var v = hv.querySelector('video'), img = hv.querySelector('img.m');
  var RM = root.classList.contains('rm'), con = navigator.connection || {}, SD = !!con.saveData;
  if (!v || RM || SD || !window.HTMLVideoElement) return;
  var small = innerWidth <= 900 || /(^|-)(2g|3g)$/.test(con.effectiveType || '');
  var base = v.getAttribute('data-src'), started = false;
  function attach() {
    if (started) return; started = true;
    var w = small ? '960' : '1920', types = [['webm', 'video/webm; codecs="vp9"'], ['mp4', 'video/mp4']];
    types.forEach(function (t) { var s = d.createElement('source'); s.src = base + '-' + w + '.' + t[0]; s.type = t[1]; v.appendChild(s); });
    v.load();
    v.addEventListener('playing', function () { v.classList.add('on'); }, { once: true });
    var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stays */ });
  }
  function go() { setTimeout(attach, 150); }
  function afterPoster() {
    var ready = img && img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    ready.then(function () { if (d.readyState === 'complete') go(); else addEventListener('load', go, { once: true }); });
  }
  afterPoster();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (!started) return; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: 0 }).observe(hv);
  }
  d.addEventListener('visibilitychange', function () { if (!started) return; if (d.hidden) v.pause(); else if (hv.getBoundingClientRect().bottom > 0) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
})();
