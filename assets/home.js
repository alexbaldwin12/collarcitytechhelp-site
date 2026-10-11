(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ring = document.querySelector('.gauge .ring'); var score = document.querySelector('.gauge .gscore');
  var R = 52, C = 2 * Math.PI * R;
  if (ring) { ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C * (1 - 0.7); }
  if (reduce || !window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var lenis = new Lenis(); lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('motion');
  var h1 = document.querySelector('[data-split]');
  var sp = SplitText.create(h1, { type: 'lines', mask: 'lines' }); gsap.set(h1, { visibility: 'visible' });
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(sp.lines, { yPercent: 105, duration: .9, stagger: .12 })
    .from('.herobg .lead, .herobg .ctas, .herobg .note', { y: 18, opacity: 0, duration: .6, stagger: .1 }, '-=.5')
    .from('.gauge', { y: 30, opacity: 0, duration: .8 }, '-=.9');
  if (ring) {
    ring.style.strokeDashoffset = C;
    var o = { v: 0 };
    gsap.to(ring, { strokeDashoffset: C * (1 - 0.7), duration: 1.6, delay: .7, ease: 'power2.out' });
    gsap.to(o, { v: 7, duration: 1.6, delay: .7, ease: 'power2.out', onUpdate: function () { score.textContent = Math.round(o.v); } });
    gsap.from('.gauge li', { x: -14, opacity: 0, stagger: .15, duration: .5, delay: 1.1 });
  }
  gsap.utils.toArray('main > section').forEach(function (sec) {
    var w = sec.querySelector('.wrap'); if (!w) return;
    gsap.from(w, { y: 40, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: sec, start: 'top 85%', once: true } });
  });
  gsap.utils.toArray('.pkg, .step').forEach(function (el, i) { gsap.from(el, { y: 26, opacity: 0, duration: .6, delay: (i % 3) * .08, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }); });
})();
