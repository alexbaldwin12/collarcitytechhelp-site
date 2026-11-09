/* Kettle Point (example). Shared on every page: live desk status, menu, headline reveals, sample availability data,
   weekend tickets, booking form prefill and demo. No network calls, no storage, no cookies, no analytics. */
(function () {
  'use strict';
  var d = document, RM = d.documentElement.classList.contains('rm');
  var $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };

  /* ---- live status: the booking desk phone line, 8 am to 8 pm Eastern (sample hours) ---- */
  var DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function fmt(m) { var h = Math.floor(m / 60), ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + ' ' + ap; }
  function nowET() {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date()), o = {};
      p.forEach(function (x) { o[x.type] = x.value; });
      return { dow: DN.indexOf(o.weekday), min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { return null; }
  }
  function paint() {
    var n = nowET(); if (!n) return;
    var open = n.min >= 480 && n.min < 1200, txt;
    if (open) txt = 'Phone desk open until ' + fmt(1200);
    else if (n.min < 480) txt = 'Phone desk opens at ' + fmt(480) + ' today';
    else txt = 'Phone desk opens ' + fmt(480) + ' tomorrow';
    $$('[data-status]').forEach(function (el) { el.textContent = txt; var h = el.closest('.pill-status'); if (h) h.classList.toggle('is-open', open); });
    $$('[data-open-text]').forEach(function (el) { el.textContent = open ? 'Open now' : 'Closed now'; });
  }
  paint(); setInterval(paint, 60000);

  /* ---- menu ---- */
  var mb = $('.menu-btn'), nav = $('#nav');
  if (mb && nav) {
    mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu'; });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = 'Menu'; } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { mb.click(); mb.focus(); } });
  }

  /* ---- headline reveals: one device, a rise out of a mask, used on section headings only ---- */
  var ms = $$('.mask');
  if (ms.length) {
    if (!('IntersectionObserver' in window) || RM) ms.forEach(function (e) { e.classList.add('in'); });
    else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
      ms.forEach(function (e) { io.observe(e); });
    }
  }

  /* ---- sample availability and rates (made up, but computed from today's date so it always looks current) ---- */
  function day(n) { var x = new Date(); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() + n); return x; }
  function key(dt) { return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); }
  function parse(s) { var p = (s || '').split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2], 12) : null; }
  function hash(n) { var x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = (x * 2246822519) >>> 0; x ^= x >>> 13; return x % 100; }
  function epochDay(dt) { return Math.floor(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) / 86400000); }
  function booked(dt) { // is the night that starts on this date taken?
    var e = epochDay(dt), wk = Math.floor((e + 3) / 7), wd = dt.getDay();
    if (wd === 5 || wd === 6) return hash(wk) < 44;                 // Fri and Sat nights go together
    if (wd === 0 || wd === 1 || wd === 2 || wd === 3 || wd === 4) return hash(wk + 5000) < 22 && wd < 4; // some mid-week stays
    return false;
  }
  function rate(dt) { // sample nightly rate
    var m = dt.getMonth(), wd = dt.getDay(), base = (wd === 5 || wd === 6) ? 320 : 240;
    if (m >= 5 && m <= 8) base = Math.round(base * 1.2 / 5) * 5;    // summer
    else if (m === 9) base = Math.round(base * 1.12 / 5) * 5;      // fall color
    return base;
  }
  var CLEAN = 120;
  window.KP = { day: day, key: key, parse: parse, booked: booked, rate: rate, clean: CLEAN };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---- weekend tickets ---- */
  var tix = $('#tix');
  if (tix) {
    tix.innerHTML = '';
    var first = null, shown = 0;
    for (var i = 0; i < 90 && shown < 12; i++) {
      var f = day(1 + i); if (f.getDay() !== 5) continue;
      var sun = new Date(f); sun.setDate(f.getDate() + 2);
      var sat = new Date(f); sat.setDate(f.getDate() + 1);
      var free = !booked(f) && !booked(sat), li = d.createElement('li'), a = d.createElement('a');
      var price = rate(f) + rate(sat) + CLEAN;
      li.className = free ? 'open' : 'booked';
      a.href = free ? 'contact.html?arrive=' + key(f) + '&leave=' + key(sun) + '#book' : '#';
      if (!free) a.setAttribute('aria-disabled', 'true');
      a.innerHTML = '<div class="d">' + MON[f.getMonth()] + ' ' + f.getDate() + '</div><div class="m">Friday to Sunday, 2 nights</div><div class="s"><span>' + (free ? 'Open' : 'Booked') + '</span><b>' + (free ? 'from $' + price : '&nbsp;') + '</b></div>';
      if (free && !first) { first = f; var nx = d.getElementById('nextwk'); if (nx) nx.textContent = MON[f.getMonth()] + ' ' + f.getDate() + ' to ' + sun.getDate(); }
      li.appendChild(a); tix.appendChild(li); shown++;
    }
  }

  /* ---- booking form: prefill dates and guests from the link (dates are not personal data), demo submit ---- */
  var form = $('#book-form');
  if (form) {
    var q = new URLSearchParams(location.search), ar = q.get('arrive'), lv = q.get('leave'), gu = q.get('guests');
    if (parse(ar) && parse(lv)) { $('#f-in').value = ar; $('#f-out').value = lv; var n = $('#prefill'); if (n) { n.hidden = false; n.textContent = 'Dates filled in from the calendar: ' + ar + ' to ' + lv + '.'; } }
    if (gu && /^[1-5]$/.test(gu)) $('#f-guests').value = gu;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = $('#form-msg');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      m.textContent = 'Demo only: nothing was sent and nothing was saved. On a live site this reaches the owner, who replies within the hour while the phone desk is open.';
      m.focus();
    });
  }
})();
