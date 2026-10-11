/* Collar City Tech Help site script. Respects prefers-reduced-motion; content is always visible without it. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hdr = document.querySelector('.site-header');
  function onScroll() { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  var tog = document.querySelector('.nav-toggle'), nav = document.getElementById('site-nav');
  if (tog && nav) {
    tog.addEventListener('click', function () { var o = nav.classList.toggle('open'); tog.setAttribute('aria-expanded', o ? 'true' : 'false'); tog.textContent = o ? 'Close' : 'Menu'; });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); tog.setAttribute('aria-expanded', 'false'); tog.textContent = 'Menu'; } });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav && nav.classList.contains('open')) { nav.classList.remove('open'); tog.setAttribute('aria-expanded', 'false'); tog.textContent = 'Menu'; tog.focus(); } });
  document.querySelectorAll('.swiper').forEach(function (el) {
    var o = {}; try { o = JSON.parse(el.getAttribute('data-swiper') || '{}'); } catch (e) {}
    o.a11y = { enabled: true }; o.keyboard = { enabled: true }; if (window.Swiper) new Swiper(el, o);
  });
  var ring = document.querySelector('.gauge .ring'), score = document.querySelector('.gauge .gscore'), C = 2 * Math.PI * 52;
  if (ring) { ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C * 0.3; }
  if (reduce || !window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var lenis = new Lenis(); lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
  var h1 = document.querySelector('h1[data-split]');
  if (h1) {
    var sp = SplitText.create(h1, { type: 'lines', mask: 'lines' }); document.documentElement.classList.add('motion'); gsap.set(h1, { visibility: 'visible' });
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(sp.lines, { yPercent: 105, duration: .85, stagger: .1 });
    if (document.querySelector('.hero')) {
      tl.from('.hero .lead, .hero .ctas, .hero .note', { y: 18, opacity: 0, duration: .6, stagger: .1 }, '-=.5').from('.gauge', { y: 28, opacity: 0, duration: .8 }, '-=.9');
      if (ring) { ring.style.strokeDashoffset = C; var o = { v: 0 }; gsap.to(ring, { strokeDashoffset: C * 0.3, duration: 1.6, delay: .7, ease: 'power2.out' }); gsap.to(o, { v: 7, duration: 1.6, delay: .7, ease: 'power2.out', onUpdate: function () { score.textContent = Math.round(o.v); } }); gsap.from('.gauge li', { x: -14, opacity: 0, stagger: .15, duration: .5, delay: 1.1 }); }
    }
  }
  gsap.utils.toArray('main > section.sec > .wrap, main .reveal').forEach(function (el) { gsap.from(el, { y: 36, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); });
  gsap.utils.toArray('.svc, .tier, .step, .row').forEach(function (el, i) { gsap.from(el, { y: 22, opacity: 0, duration: .55, delay: (i % 4) * .06, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
