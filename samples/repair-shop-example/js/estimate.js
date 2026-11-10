/* Estimate builder: vehicle type + issue -> a line-item sample estimate that "prints" -> Book this carries vehicle, issue and range into the booking form.
   Ranges are the same sample ranges as the price board (made up for this example). Reveal uses clip-path + transform + opacity only. */
(function () {
  'use strict';
  var d = document, box = d.getElementById('estb-slip'); if (!box) return;
  var RM = d.documentElement.classList.contains('rm'), D = JSON.parse(d.getElementById('estb-data').textContent);
  var veh = [].slice.call(d.querySelectorAll('#estb-veh [data-c]')), iss = [].slice.call(d.querySelectorAll('#estb-iss [data-s]'));
  var cls = 'a', svc = null, n = 0, seen = false;
  function money(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
  function r5(x) { return Math.max(0, Math.round(x / 5) * 5); }
  function lines(s, c) {
    var r = s.r[c], lo = r[0], hi = r[1], out = [], a = 0, b = 0;
    s.l.forEach(function (it, i) {
      var last = i === s.l.length - 1, l = last ? lo - a : r5(lo * it[1]), h = last ? hi - b : r5(hi * it[1]);
      if (l < 0) l = 0; a += l; b += h; out.push([it[0], l, h]);
    });
    return out;
  }
  function render() {
    if (!svc) { box.innerHTML = '<div class="slip empty"><p>Choose what it needs and your sample estimate prints here.</p></div>'; return; }
    var s = D.svc[svc], r = s.r[cls], L = lines(s, cls), no = 'EST-' + String(100 + (++n)).slice(-3);
    var rows = L.map(function (x, i) { return '<li style="--k:' + i + '"><span>' + x[0] + '</span><i></i><b>' + (x[1] === x[2] ? money(x[1]) : money(x[1]) + ' to ' + money(x[2])) + '</b></li>'; }).join('');
    var href = 'contact.html?service=' + svc + '&class=' + cls + '&est=' + r[0] + '-' + r[1] + '#book';
    box.innerHTML = '<div class="slip"><div class="slip-h"><b>ESTIMATE</b><span>' + no + ' &middot; EXAMPLE</span></div>' +
      '<dl><dt>Vehicle</dt><dd>' + D.classes[cls] + '</dd><dt>Work</dt><dd>' + s.n + '</dd><dt>Typical time</dt><dd>' + s.t + '</dd></dl>' +
      '<ul class="lines">' + rows + '</ul>' +
      '<div class="slip-t" style="--k:' + L.length + '"><span>Sample range</span><b>' + money(r[0]) + ' to ' + money(r[1]) + '</b></div>' +
      '<p class="slip-n" style="--k:' + (L.length + 1) + '">A sample range, not a quote. A technician confirms the exact figure after inspection and you approve it before any work starts.</p>' +
      '<a class="btn dark sm" style="--k:' + (L.length + 1) + '" href="' + href + '">Book this <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a></div>';
    if (!RM) { var el = box.firstChild; el.classList.add('print'); }
  }
  function sync() {
    veh.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === cls)); });
    iss.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-s') === svc)); });
  }
  veh.forEach(function (b) { b.addEventListener('click', function () { cls = b.getAttribute('data-c'); sync(); render(); }); });
  iss.forEach(function (b) { b.addEventListener('click', function () { svc = b.getAttribute('data-s'); sync(); render(); }); });
  render();
  // print the first one when the section scrolls into view, so the reveal is seen
  if (!RM && 'IntersectionObserver' in window) {
    svc = null; render();
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting && !seen) { seen = true; io.disconnect(); setTimeout(function () { if (!svc) { svc = 'brakes'; sync(); render(); } }, 350); } }, { threshold: .35 }); io.observe(box);
  } else { svc = 'brakes'; sync(); render(); }
})();
