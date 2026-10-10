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
  gsap.from(sp.lines, { yPercent: 110, duration: .8, stagger: .1, ease: 'expo.out' });
  gsap.from('.heroimg', { clipPath: 'inset(0 100% 0 0)', duration: 1.2, delay: .3, ease: 'power3.inOut' });
  gsap.from('.heroimg img', { scale: 1.2, duration: 1.6, delay: .3, ease: 'power2.out' });
  gsap.from('.grid li', { y: 30, opacity: 0, stagger: .08, duration: .6, scrollTrigger: { trigger: '.grid', start: 'top 85%', once: true } });
  gsap.set('.steps .line', { '--p': 0 });
  gsap.to('.steps .line', { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  gsap.utils.toArray('.steps li').forEach(function (li) { gsap.from(li, { x: 24, opacity: 0, duration: .6, scrollTrigger: { trigger: li, start: 'top 85%', once: true } }); });
  reveal('.work .wrap, .contact .two > *', 30);
})();
