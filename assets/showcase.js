/* Showpiece previews: the real poster shows first. A short muted looping clip (small copy, about 0.1 to 0.3 MB) is fetched only when the card is
   half on screen, hovered, focused or touched. Reduced motion or Save-Data: poster only. No JavaScript: poster plus links. */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, c = navigator.connection || {};
  if (RM || c.saveData || !window.IntersectionObserver) return;
  [].forEach.call(document.querySelectorAll('.sc-card[data-clip]'), function (card) {
    var stage = card.querySelector('.sc-stage'), v = card.querySelector('video'), base = card.getAttribute('data-clip'), loaded = false, vis = false;
    if (!stage || !v) return;
    function load() {
      if (loaded) return; loaded = true;
      [['webm', 'video/webm; codecs="vp9"'], ['mp4', 'video/mp4']].forEach(function (t) { var s = document.createElement('source'); s.src = base + '.' + t[0]; s.type = t[1]; v.appendChild(s); });
      v.muted = true; v.preload = 'auto'; v.load();
      v.addEventListener('playing', function () { stage.classList.add('live'); }, { once: true });
      if (vis) play();
    }
    function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { load(); if (loaded) play(); } else v.pause(); }, { threshold: 0.5 }).observe(stage);
    ['pointerenter', 'touchstart', 'focusin'].forEach(function (e) { card.addEventListener(e, load, { passive: true, once: true }); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) v.pause(); else if (vis && loaded) play(); });
  });
})();
