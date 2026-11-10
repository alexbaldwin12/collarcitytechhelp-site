/* Bay Nine Auto (example). Shared: live open/closed status, menu, reveals, dipstick, booking prefill, demo form.
   No network calls, no storage, no analytics. */
(function () {
  'use strict';
  var d = document, RM = d.documentElement.classList.contains('rm');

  /* ---- live status from the sample hours, in the shop's timezone (America/New_York) ---- */
  // index 0 = Sunday. [open, close] in minutes after midnight.
  var H = [null, [450, 1050], [450, 1050], [450, 1050], [450, 1050], [450, 1050], [480, 780]];
  var DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + ' ' + ap; }
  function now() {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date()), o = {};
      p.forEach(function (x) { o[x.type] = x.value; });
      return { dow: DN.indexOf(o.weekday), min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { return null; }
  }
  function status() {
    var n = now(); if (!n) return null;
    var t = H[n.dow];
    if (t && n.min >= t[0] && n.min < t[1]) return { open: true, text: 'Open now, closes ' + fmt(t[1]), dow: n.dow };
    for (var i = 0; i < 8; i++) {
      var dd = (n.dow + i) % 7, h = H[dd];
      if (!h) continue;
      if (i === 0 && n.min >= h[0]) continue;
      var when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DN[dd];
      return { open: false, text: 'Closed, opens ' + when + ' at ' + fmt(h[0]), dow: n.dow };
    }
    return { open: false, text: 'Closed', dow: n.dow };
  }
  function paint() {
    var s = status(); if (!s) return;
    [].forEach.call(d.querySelectorAll('[data-status]'), function (el) {
      el.textContent = s.text;
      var host = el.closest('.pill-status') || el.parentNode;
      if (host) host.classList.toggle('is-open', s.open);
    });
    [].forEach.call(d.querySelectorAll('.hours tr[data-d]'), function (tr) { tr.classList.toggle('today', +tr.getAttribute('data-d') === s.dow); });
  }
  paint(); setInterval(paint, 60000);

  /* ---- menu ---- */
  var mb = d.querySelector('.menu-btn'), nav = d.getElementById('nav');
  if (mb && nav) {
    mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu'; });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = 'Menu'; } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { mb.click(); mb.focus(); } });
  }

  /* ---- reveals (orchestrated: items in a group share an index via --i) ---- */
  var rv = d.querySelectorAll('.rv,.mask');
  if (rv.length) {
    if (!('IntersectionObserver' in window) || RM) { [].forEach.call(rv, function (e) { e.classList.add('in'); }); }
    else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      [].forEach.call(rv, function (e) { io.observe(e); });
    }
  }
  [].forEach.call(d.querySelectorAll('.lane'), function (l) {
    if (RM || !('IntersectionObserver' in window)) return;
    l.style.setProperty('--p', 0);
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var t0 = performance.now(); (function f(t) { var k = Math.min(1, (t - t0) / 1400); l.style.setProperty('--p', 1 - Math.pow(1 - k, 3)); if (k < 1) requestAnimationFrame(f); })(t0); io2.unobserve(l); } }); }, { threshold: .5 });
    io2.observe(l);
  });

  /* ---- oil dipstick: page progress as an oil level ---- */
  var lvl = d.getElementById('dipLvl');
  if (lvl) {
    lvl.setAttribute('y', 12); lvl.setAttribute('height', 188);
    var tick = false;
    function dip() { tick = false; var h = d.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0, H0 = 200, v = 8 + p * (H0 - 16); lvl.style.transform = 'scaleY(' + (v / (H0 - 12)).toFixed(4) + ')'; }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(dip); } }, { passive: true }); dip();
  }

  /* ---- booking prefill: ?service=brakes (a service name, not personal data) ---- */
  var sel = d.getElementById('f-service');
  if (sel) {
    var q = new URLSearchParams(location.search).get('service');
    if (q) { for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === q) { sel.selectedIndex = i; break; } } var tag = d.getElementById('prefill-note'); if (tag) { tag.hidden = false; tag.textContent = 'Service chosen: ' + sel.options[sel.selectedIndex].text + '. Change it below if you like.'; } }
    var form = d.getElementById('ro-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = d.getElementById('form-msg');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      m.textContent = 'Demo only: nothing was sent and nothing was saved. On a real site this request would go to the shop and you would get a call or text back the same business day.';
      m.focus();
    });
    // vehicle year options
    var y = d.getElementById('f-year'), cy = new Date().getFullYear() + 1;
    if (y && y.options.length < 3) { for (var k = cy; k >= 1996; k--) { var o = d.createElement('option'); o.value = o.textContent = k; y.appendChild(o); } }
  }
  /* ---- floor plan captions (about page) ---- */
  var plan = d.getElementById('plan');
  if (plan) {
    var cap = d.getElementById('plan-cap'), data = JSON.parse(d.getElementById('plan-data').textContent);
    function pick(id) { [].forEach.call(plan.querySelectorAll('.bay'), function (b) { b.classList.toggle('on', b.getAttribute('data-bay') === id); }); var x = data[id]; cap.innerHTML = '<h3 style="font-size:1.9rem;margin-bottom:.3em">' + x[0] + '</h3><p class="muted">' + x[1] + '</p>'; }
    [].forEach.call(plan.querySelectorAll('.bay'), function (b) {
      b.setAttribute('tabindex', '0'); b.setAttribute('role', 'button'); b.setAttribute('aria-label', b.getAttribute('data-label'));
      b.addEventListener('click', function () { pick(b.getAttribute('data-bay')); });
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(b.getAttribute('data-bay')); } });
    });
    pick('9');
  }
})();
