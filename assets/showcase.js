/* Examples section behaviour (both tiers).
   Business band + Starter hover card: the real poster shows first. A short muted looping clip (0.1 to 0.3 MB) is fetched only when the card is
   half on screen (Business, and Starter on touch screens), or hovered / focused (Starter with a mouse). Reduced motion or Save-Data: poster only.
   No JavaScript: poster plus links.
   Starter phone: "Scroll the real page" puts the live sample page (lazy iframe, sandboxed, scaled to a 390 px phone) in the phone, only after a click or tap.
   Starter tilt card: the screenshot leans toward the pointer (mouse only, not with reduced motion). */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, c = navigator.connection || {};
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Starter: live phone */
  [].forEach.call(document.querySelectorAll('.st-phone[data-live]'), function (ph) {
    var btn = ph.parentNode.querySelector('.st-live'), scr = ph.querySelector('.st-screen'), fr = null;
    if (!btn || !scr) return;
    btn.hidden = false;
    function fit() { if (fr) fr.style.setProperty('--fs', (scr.clientWidth / 390).toFixed(4)); }
    if (window.ResizeObserver) new ResizeObserver(fit).observe(scr); else addEventListener('resize', fit);
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      if (on && !fr) {
        fr = document.createElement('iframe');
        fr.className = 'st-frame'; fr.src = ph.getAttribute('data-live'); fr.title = ph.getAttribute('data-title') || 'Sample site preview';
        fr.loading = 'lazy'; fr.setAttribute('sandbox', 'allow-scripts'); fr.setAttribute('referrerpolicy', 'no-referrer');
        scr.appendChild(fr); fit();
      }
      if (fr) fr.hidden = !on;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Back to the picture' : 'Scroll the real page';
      if (on && fr) fr.focus();
    });
  });

  /* Starter: tilt card */
  if (fine && !RM) [].forEach.call(document.querySelectorAll('.st-tilt'), function (t) {
    var i = t.querySelector('.st-tiltin'), st = t.querySelector('.st-stage');
    if (!i) return;
    t.addEventListener('pointermove', function (e) {
      var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      i.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg'); i.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg');
      i.style.setProperty('--sx', (x * 100).toFixed(1) + '%'); i.style.setProperty('--sy', (y * 100).toFixed(1) + '%'); i.style.setProperty('--so', '1');
    });
    t.addEventListener('pointerleave', function () { ['--rx', '--ry'].forEach(function (k) { i.style.setProperty(k, '0deg'); }); i.style.setProperty('--so', '0'); });
  });

  /* Clips */
  if (RM || c.saveData || !window.IntersectionObserver) return;
  [].forEach.call(document.querySelectorAll('.sc-card[data-clip],.st-card[data-clip]'), function (card) {
    var stage = card.querySelector('.sc-stage,.st-stage'), v = card.querySelector('video'), base = card.getAttribute('data-clip'), loaded = false, vis = false, hov = false;
    var hoverMode = card.hasAttribute('data-hover') && fine;
    if (!stage || !v) return;
    function load() {
      if (loaded) return; loaded = true;
      [['webm', 'video/webm; codecs="vp9"'], ['mp4', 'video/mp4']].forEach(function (t) { var s = document.createElement('source'); s.src = base + '.' + t[0]; s.type = t[1]; v.appendChild(s); });
      v.muted = true; v.preload = 'auto'; v.load();
      v.addEventListener('playing', function () { stage.classList.add('live'); }, { once: true });
      if (hoverMode ? hov : vis) play();
    }
    function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    function want() { return hoverMode ? hov : vis; }
    function sync() { if (want()) { load(); if (loaded) play(); } else v.pause(); }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (hoverMode && !vis) { hov = false; } sync(); }, { threshold: 0.5 }).observe(stage);
    if (hoverMode) {
      card.addEventListener('pointerenter', function () { hov = true; sync(); });
      card.addEventListener('pointerleave', function () { hov = false; sync(); });
      card.addEventListener('focusin', function () { hov = true; sync(); });
      card.addEventListener('focusout', function () { hov = false; sync(); });
    } else {
      ['pointerenter', 'touchstart', 'focusin'].forEach(function (e) { card.addEventListener(e, load, { passive: true, once: true }); });
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) v.pause(); else if (loaded && want()) play(); });
  });
})();
