/* Before/after sliders. A real <input type=range> sits over each photo pair, so mouse, touch and keyboard (arrows, Home, End) all work.
   The top photo is revealed with clip-path; the handle moves with transform. Photos are two different parts, labelled as such. */
(function () {
  'use strict';
  var d = document, RM = d.documentElement.classList.contains('rm');
  [].forEach.call(d.querySelectorAll('[data-ba]'), function (fig) {
    var fr = fig.querySelector('.ba-frame'), inp = fig.querySelector('input'), bar = fig.querySelector('.ba-bar'), w = 0;
    function set(v) {
      v = Math.max(0, Math.min(100, +v)); fr.style.setProperty('--p', v);
      bar.style.transform = 'translateX(' + (w * v / 100) + 'px)';
      inp.setAttribute('aria-valuetext', v < 8 ? 'Showing the new part' : v > 92 ? 'Showing the worn part' : 'Worn part ' + Math.round(v) + ' percent, new part ' + Math.round(100 - v) + ' percent');
    }
    function size() { w = fr.clientWidth; set(inp.value); }
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(fr); else addEventListener('resize', size);
    size();
    inp.addEventListener('input', function () { set(inp.value); });
    // one small sweep the first time it scrolls into view, so people see it is draggable
    if (!RM && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io.disconnect();
        var t0 = performance.now(), keys = [[0, 50], [.3, 28], [.65, 72], [1, 50]];
        (function f(t) {
          var k = Math.min(1, (t - t0) / 1800), i = 0; while (i < keys.length - 2 && k > keys[i + 1][0]) i++;
          var a = keys[i], b = keys[i + 1], u = Math.min(1, Math.max(0, (k - a[0]) / (b[0] - a[0]))); u = u * u * (3 - 2 * u);
          var v = a[1] + (b[1] - a[1]) * u; if (d.activeElement !== inp) { inp.value = v; set(v); }
          if (k < 1) requestAnimationFrame(f);
        })(t0);
      }, { threshold: .6 });
      io.observe(fr);
    }
  });
})();
