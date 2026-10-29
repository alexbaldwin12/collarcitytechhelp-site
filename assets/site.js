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
  /* design-v2: vanilla effects replace the GSAP intro/fades (vendor scripts still load, unused here) */
  if (reduce) return;
  var h1 = document.querySelector('.hero h1');
  if (h1 && h1.firstChild && h1.childNodes.length === 1) {
    var t = h1.firstChild, i = t.nodeValue.indexOf('online');
    if (i > -1) {
      var pre = t.splitText(i), post = pre.splitText(6);
      var kin = document.createElement('span'); kin.className = 'kin';
      var on = document.createElement('span'); on.className = 'on'; on.textContent = 'on';
      var rest = document.createTextNode('line');
      pre.nodeValue = ''; kin.appendChild(on); h1.insertBefore(kin, pre); h1.insertBefore(rest, pre); h1.removeChild(pre);
      var m = document.createElement('span'); m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap'; h1.appendChild(m);
      m.textContent = 'off'; var w1 = m.offsetWidth; m.textContent = 'on'; var w2 = m.offsetWidth; h1.removeChild(m);
      kin.style.setProperty('--kw1', w1 + 'px'); kin.style.setProperty('--kw2', w2 + 'px');
      requestAnimationFrame(function () { kin.classList.add('go'); });
    }
  }
  if (!('IntersectionObserver' in window)) return;
  var items = document.querySelectorAll('#services .svc, #how .step, #pricing .tier, .blueprint .step, .tiers .tier');
  if (!items.length) return;
  var seen = [];
  items.forEach(function (el) { if (seen.indexOf(el) < 0) { seen.push(el); el.classList.add('reveal'); el.style.setProperty('--d', ((seen.length - 1) % 4) * 0.07 + 's'); } });
  document.documentElement.classList.add('js-reveal');
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
  seen.forEach(function (el) { io.observe(el); });
})();
