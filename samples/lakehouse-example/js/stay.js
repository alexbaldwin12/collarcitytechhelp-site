/* Stay page: sample availability calendar. Pick arrive, then leave. Shows nights and a sample total, and links to the
   booking form with the dates filled in. Dates and prices are made up; nothing is sent or stored. */
(function () {
  'use strict';
  var d = document, KP = window.KP; if (!KP) return;
  var host = d.getElementById('cal'); if (!host) return;
  var MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var today = KP.day(0), view = new Date(today.getFullYear(), today.getMonth(), 1, 12), a = null, b = null;
  var title = host.querySelector('.cal-top h3'), grid = host.querySelector('.cal-grid'), sum = host.querySelector('.cal-sum'), guests = d.getElementById('cal-guests');

  function ok(from, to) { // every night from..to-1 must be free
    for (var x = new Date(from); x < to; x.setDate(x.getDate() + 1)) if (KP.booked(x)) return false;
    return true;
  }
  function render() {
    title.textContent = MN[view.getMonth()] + ' ' + view.getFullYear();
    grid.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (c) { var s = d.createElement('span'); s.className = 'dn'; s.textContent = c; s.setAttribute('aria-hidden', 'true'); grid.appendChild(s); });
    for (var p = 0; p < view.getDay(); p++) { var pad = d.createElement('span'); pad.className = 'pad'; grid.appendChild(pad); }
    var last = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var n = 1; n <= last; n++) {
      var dt = new Date(view.getFullYear(), view.getMonth(), n, 12), btn = d.createElement('button');
      btn.type = 'button'; btn.textContent = n;
      var past = dt <= today && KP.key(dt) !== KP.key(today) || dt < today;
      var dis;
      if (!a || (a && b)) dis = past || KP.booked(dt) || KP.key(dt) === KP.key(today);
      else dis = dt <= a || !ok(a, dt);
      if (a && !b && dt.getTime() === a.getTime()) dis = false;
      btn.disabled = !!dis;
      if (dt.getDay() === 5) btn.className = 'fri';
      if (a && dt.getTime() === a.getTime()) btn.classList.add('end');
      if (b && dt.getTime() === b.getTime()) btn.classList.add('end');
      if (a && b && dt > a && dt < b) btn.classList.add('in');
      btn.setAttribute('aria-label', MN[dt.getMonth()] + ' ' + n + (dis ? ', not available' : ''));
      (function (dd) { btn.addEventListener('click', function () { pick(dd); }); })(dt);
      grid.appendChild(btn);
    }
    summary();
  }
  function pick(dt) {
    if (!a || (a && b)) { a = dt; b = null; }
    else if (dt.getTime() === a.getTime()) { a = null; }
    else if (dt > a && ok(a, dt)) { b = dt; }
    render();
  }
  function summary() {
    if (!a) { sum.innerHTML = '<p class="k">Pick the day you arrive. Dots mark Fridays. Crossed-out days are taken (sample calendar).</p>'; return; }
    if (!b) { sum.innerHTML = '<p class="k">Arriving ' + MN[a.getMonth()] + ' ' + a.getDate() + '. Now pick the day you leave.</p>'; return; }
    var nights = 0, tot = 0;
    for (var x = new Date(a); x < b; x.setDate(x.getDate() + 1)) { nights++; tot += KP.rate(x); }
    var g = guests ? guests.value : '3', total = tot + KP.clean;
    sum.innerHTML = '<dl><dt>' + nights + ' night' + (nights > 1 ? 's' : '') + ', ' + MN[a.getMonth()].slice(0, 3) + ' ' + a.getDate() + ' to ' + MN[b.getMonth()].slice(0, 3) + ' ' + b.getDate() + '</dt><dd>$' + tot + '</dd><dt>Cleaning fee</dt><dd>$' + KP.clean + '</dd><dt>Sample total</dt><dd class="tot">$' + total + '</dd></dl>' +
      '<p style="margin:16px 0 0"><a class="btn" href="contact.html?arrive=' + KP.key(a) + '&leave=' + KP.key(b) + '&guests=' + g + '#book">Request these dates</a></p><p class="k" style="margin:10px 0 0">Sample prices and sample calendar. Taxes not shown.</p>';
  }
  host.querySelector('.prev').addEventListener('click', function () { var m = new Date(view.getFullYear(), view.getMonth() - 1, 1, 12); if (m >= new Date(today.getFullYear(), today.getMonth(), 1, 12)) { view = m; render(); } });
  host.querySelector('.next').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1, 12); render(); });
  if (guests) guests.addEventListener('change', summary);
  render();
})();
