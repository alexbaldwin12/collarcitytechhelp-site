(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var toast, tt;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.sample-btn'); if (!b) return;
    if (!toast) { toast = document.createElement('div'); toast.className = 'sample-toast'; toast.setAttribute('role', 'status'); toast.textContent = 'Sample site: this button is just for show'; document.body.appendChild(toast); }
    toast.hidden = false; clearTimeout(tt); tt = setTimeout(function () { toast.hidden = true; }, 3500);
  });
  document.querySelectorAll('.swiper').forEach(function (el) {
    var o = JSON.parse(el.getAttribute('data-swiper') || '{}');
    o.a11y = { enabled: true }; o.keyboard = { enabled: true };
    if (reduce) { delete o.autoplay; }
    if (window.Swiper) { new Swiper(el, o); }
  });
  if (reduce || !window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var lenis = new Lenis(); lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('motion');
  function reveal(sel, y) { gsap.utils.toArray(sel).forEach(function (el) { gsap.from(el, { y: y || 36, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); }); }
  var h1 = document.querySelector('[data-split]');
  var sp = SplitText.create(h1, { type: 'lines', mask: 'lines' }); gsap.set(h1, { visibility: 'visible' });
  gsap.from(sp.lines, { yPercent: 105, duration: .9, stagger: .12, ease: 'power3.out', delay: .1 });
  gsap.from('.hr img', { clipPath: 'inset(0 0 100% 0)', scale: 1.12, duration: 1.2, ease: 'power3.out' });
  gsap.to('.hr img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.stamp', { scale: 0, rotation: -60, duration: .7, delay: .9, ease: 'back.out(1.7)' });
  gsap.utils.toArray('.dishes').forEach(function (ul) { gsap.from(ul.children, { y: 24, opacity: 0, stagger: .07, duration: .6, scrollTrigger: { trigger: ul, start: 'top 85%', once: true } }); });
  reveal('.gal h2, .visit .two > *, .rev h2', 30);
})();
