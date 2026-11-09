/* Stay page: sample availability calendar. Pick arrive, then leave. Shows nights and a sample total, and links to the
   booking form with the dates filled in. Dates and prices are made up; nothing is sent or stored. */
(function () {
  'use strict';
  var d = document, KP = window.KP; if (!KP) return;
  var host = d.getElementById('cal'); if (!host) return;
  var RM = d.documentElement.classList.contains('rm');
  var MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var today = KP.day(0), view = new Date(today.getFullYear(), today.getMonth(), 1, 12), a = null, b = null;
  var title = host.querySelector('.cal-top h3'), grid = host.querySelector('.cal-grid'), sum = host.querySelector('.cal-sum'), guests = d.getElementById('cal-guests');

  function ok(from, to) { // every night from..to-1 must be free
    for (var x = new Date(from); x < to; x.setDate(x.getDate() + 1)) if (KP.booked(x)) return false;
    return true;
  }
  var flipNext = true;
  function render() {
    grid.classList.toggle('flip', flipNext); flipNext = false;
    title.textContent = MN[view.getMonth()] + ' ' + view.getFullYear();
    grid.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (c) { var s = d.createElement('span'); s.className = 'dn'; s.textContent = c; s.setAttribute('aria-hidden', 'true'); grid.appendChild(s); });
    for (var p = 0; p < view.getDay(); p++) { var pad = d.createElement('span'); pad.className = 'pad'; grid.appendChild(pad); }
    var last = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var n = 1; n <= last; n++) {
      var dt = new Date(view.getFullYear(), view.getMonth(), n, 12), btn = d.createElement('button');
      btn.type = 'button'; btn.textContent = n; btn.style.setProperty('--i', n - 1);
      var past = dt <= today && KP.key(dt) !== KP.key(today) || dt < today;
      var dis;
      if (!a || (a && b)) dis = past || KP.booked(dt) || KP.key(dt) === KP.key(today);
      else dis = dt <= a || !ok(a, dt);
      if (a && !b && dt.getTime() === a.getTime()) dis = false;
      btn.disabled = !!dis;
      if (dt.getDay() === 5) btn.className = 'fri';
      if (a && dt.getTime() === a.getTime()) btn.classList.add('end');
      if (b && dt.getTime() === b.getTime()) btn.classList.add('end');
      if (a && b && dt > a && dt < b) { btn.classList.add('in'); btn.style.setProperty('--k', Math.round((dt - a) / 86400000)); }
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
  var shown = 0, raf = 0;
  function countTo(el, to, from) {
    if (RM || from === to) { el.textContent = '$' + to; shown = to; return; }
    var t0 = null, dur = 750; cancelAnimationFrame(raf);
    (function step(t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = '$' + Math.round(from + (to - from) * e); shown = Math.round(from + (to - from) * e); if (p < 1) raf = requestAnimationFrame(step); })(performance.now());
  }
  function summary() {
    if (!a) { shown = 0; sum.innerHTML = '<p class="k">Pick the day you arrive. Dots mark Fridays. Crossed-out days are taken (sample calendar).</p>'; return; }
    if (!b) { shown = 0; sum.innerHTML = '<p class="k">Arriving ' + MN[a.getMonth()] + ' ' + a.getDate() + '. Now pick the day you leave.</p>'; return; }
    var nights = 0, tot = 0, wk = 0;
    for (var x = new Date(a); x < b; x.setDate(x.getDate() + 1)) { nights++; tot += KP.rate(x); if (x.getDay() === 5 || x.getDay() === 6) wk++; }
    var g = guests ? guests.value : '3', total = tot + KP.clean, prev = shown;
    sum.innerHTML = '<dl><dt>' + nights + ' night' + (nights > 1 ? 's' : '') + ', ' + MN[a.getMonth()].slice(0, 3) + ' ' + a.getDate() + ' to ' + MN[b.getMonth()].slice(0, 3) + ' ' + b.getDate() + (wk ? ' (' + wk + ' weekend night' + (wk > 1 ? 's' : '') + ')' : '') + '</dt><dd>$' + tot + '</dd><dt>Cleaning fee</dt><dd>$' + KP.clean + '</dd><dt>Sample total</dt><dd class="tot" aria-label="Sample total $' + total + '">$' + (RM ? total : prev) + '</dd></dl>' +
      '<p style="margin:16px 0 0"><a class="btn" href="contact.html?arrive=' + KP.key(a) + '&leave=' + KP.key(b) + '&guests=' + g + '&total=' + total + '#book">Request these dates</a></p><p class="k" style="margin:10px 0 0">Sample prices and sample calendar. Taxes not shown.</p>';
    sum.classList.remove('pop'); void sum.offsetWidth; sum.classList.add('pop');
    countTo(sum.querySelector('.tot'), total, prev);
  }
  host.querySelector('.prev').addEventListener('click', function () { var m = new Date(view.getFullYear(), view.getMonth() - 1, 1, 12); if (m >= new Date(today.getFullYear(), today.getMonth(), 1, 12)) { view = m; flipNext = true; render(); } });
  host.querySelector('.next').addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1, 12); flipNext = true; render(); });
  if (guests) guests.addEventListener('change', summary);
  /* quick picks: the next three open weekends (Friday to Sunday). Selecting one fills the calendar and counts the total up. */
  var qk = d.getElementById('cal-quick');
  if (qk) {
    var MS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], found = 0;
    qk.innerHTML = '<span class="k">Open weekends</span>';
    for (var i = 1; i < 120 && found < 3; i++) {
      var f = KP.day(i); if (f.getDay() !== 5) continue;
      var sat = new Date(f); sat.setDate(f.getDate() + 1); var sun = new Date(f); sun.setDate(f.getDate() + 2);
      if (KP.booked(f) || KP.booked(sat)) continue;
      found++;
      var bt = d.createElement('button'); bt.type = 'button'; bt.textContent = MS[f.getMonth()] + ' ' + f.getDate() + ' to ' + sun.getDate();
      bt.setAttribute('aria-label', 'Select the weekend of ' + MN[f.getMonth()] + ' ' + f.getDate() + ' to ' + sun.getDate() + ', two nights');
      (function (ff, ss) { bt.addEventListener('click', function () { a = ff; b = ss; var nv = new Date(ff.getFullYear(), ff.getMonth(), 1, 12); flipNext = nv.getTime() !== view.getTime(); view = nv; render(); }); })(f, sun);
      qk.appendChild(bt);
    }
  }
  render();
})();
