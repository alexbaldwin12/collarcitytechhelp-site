/* Fleet page: the sample dashboard counts up and its bars rise when it scrolls into view (transform and opacity only).
   All numbers are made up and labelled as sample data. Static final values without JS or with reduced motion. */
(function () {
  'use strict';
  var d = document, dash = d.getElementById('dash'); if (!dash) return;
  var root = d.documentElement; if (!root.classList.contains('js') || root.classList.contains('rm')) return;
  dash.classList.add('arm');
  var counts = [].slice.call(dash.querySelectorAll('[data-count]'));
  function fmt(el, v) { var dec = +(el.getAttribute('data-dec') || 0), t = v.toFixed(dec); if (el.getAttribute('data-fmt') === 'n') t = Math.round(v).toLocaleString('en-US'); el.textContent = t; }
  counts.forEach(function (el) { fmt(el, 0); });
  function run() {
    dash.classList.add('go');
    var t0 = performance.now(), dur = 1600;
    (function f(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); counts.forEach(function (el) { fmt(el, +el.getAttribute('data-count') * e); }); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: .35 }); io.observe(dash); } else { dash.classList.add('go'); counts.forEach(function (el) { fmt(el, +el.getAttribute('data-count')); }); }
})();
