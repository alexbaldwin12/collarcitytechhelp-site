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
  var sp = SplitText.create(h1, { type: 'words', mask: 'words' }); gsap.set(h1, { visibility: 'visible' });
  gsap.from(sp.words, { yPercent: 100, duration: 1, stagger: .12, ease: 'power4.out' });
  gsap.from('.hero .arch', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, stagger: .15, delay: .35, ease: 'power3.inOut' });
  gsap.to('.arches .s:first-child', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.arches', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.to('.arches .s.r', { yPercent: -22, ease: 'none', scrollTrigger: { trigger: '.arches', start: 'top bottom', end: 'bottom top', scrub: true } });
  reveal('.serv .narrow, .studio .two > *, .visit .narrow', 34);
})();
