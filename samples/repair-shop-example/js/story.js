/* "How a repair works": a pinned, scroll-driven five-step story (Check in, Inspect, Approve, Fix, Pick up) with real photos.
   GSAP ScrollTrigger scrubs one timeline over a sticky stage (opacity, transform and a clip-path wipe only).
   Reduced motion or no JS: the CSS shows the five steps stacked, each with its photo. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, sec = d.getElementById('how'); if (!sec) return;
  if (!root.classList.contains('js') || root.classList.contains('rm') || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var steps = gsap.utils.toArray('.story-steps .st', sec), figs = gsap.utils.toArray('.story-photos figure', sec), rail = sec.querySelector('.story-rail i');
  // load every photo now that the story is near
  var near = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { near.disconnect(); figs.forEach(function (f) { var im = f.querySelector('img'); if (im) im.loading = 'eager'; }); } }, { rootMargin: '1200px 0px' });
  near.observe(sec);
  var N = steps.length, tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: .6 } });
  function ov(f) { return f.querySelector('.phone,.apv,.sms'); }
  figs.forEach(function (f, i) {
    var t0 = i, ob = ov(f), im = f.querySelector('img');
    if (i > 0) {
      tl.fromTo(f, { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: .5 }, t0 + .05);
      tl.fromTo(im, { scale: 1.14 }, { scale: 1, duration: 1, ease: 'power1.out' }, t0 + .05);
    } else { tl.fromTo(im, { scale: 1.08 }, { scale: 1, duration: .9, ease: 'power1.out' }, 0); }
    if (ob) { tl.fromTo(ob, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: .4 }, t0 + .4); if (i < N - 1) tl.to(ob, { autoAlpha: 0, duration: .2 }, t0 + .9); }
    if (i < N - 1) tl.to(f, { autoAlpha: 0, duration: .01 }, t0 + 1.0);
  });
  steps.forEach(function (s, i) {
    if (i > 0) tl.fromTo(s, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: .4 }, i + .1);
    if (i < N - 1) tl.to(s, { autoAlpha: 0, y: -26, duration: .25 }, i + .75);
  });
  var stamp = sec.querySelector('.stamp'); if (stamp) tl.fromTo(stamp, { scale: 1.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .25, ease: 'back.out(2)' }, 2.55);
  if (rail) tl.to(rail, { scaleY: 1, duration: N, ease: 'none' }, 0);
  tl.set({}, {}, N);
  // the previous photo must stay under the next while it wipes in: keep it until the next is fully in
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
