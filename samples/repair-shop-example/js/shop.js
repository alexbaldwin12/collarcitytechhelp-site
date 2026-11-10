/* Bays and technicians: the page ships the 9-bay board as static HTML; the size switch re-renders from the JSON (same lists as the build config). */
(function () {
  'use strict';
  var d = document, data = d.getElementById('shop-data'); if (!data) return;
  var P = JSON.parse(data.textContent), ST = { open: 'Open', busy: 'In service', parts: 'Waiting on parts' };
  var bb = d.getElementById('bboard'), tg = d.getElementById('tgrid'), sum = d.getElementById('shop-sum'), btns = d.querySelectorAll('#presets button');
  var AV = '<div class="av" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="15" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 36c1-8 7-12 14-12s13 4 14 12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div>';
  function esc(t) { return String(t); }
  function render(k) {
    var p = P[k], n = 0, out = '', last = '';
    p.bays.forEach(function (b, i) {
      var loc = /&middot;/.test(b.n) ? b.n.split(' &middot; ')[0] : '', nm = loc ? b.n.split(' &middot; ')[1] : b.n;
      if (loc && loc !== last) { out += '<li class="bloc" aria-hidden="false"><h3>' + loc + '</h3></li>'; last = loc; }
      out += '<li class="bcard" data-state="' + b.s + '"><div class="bh"><span class="bn">' + ('0' + (i + 1)).slice(-2) + '</span><span class="bs"><i></i>' + ST[b.s] + '</span></div><h3>' + esc(nm) + '</h3><p class="lift">' + esc(b.l) + '</p><p>' + esc(b.j) + '</p><p class="eqp">' + esc(b.e) + '</p></li>';
    });
    bb.innerHTML = out; bb.setAttribute('data-n', p.bays.length);
    tg.innerHTML = p.techs.map(function (t) { return '<li class="tcard">' + AV + '<h3>' + esc(t.r) + '</h3><p>' + esc(t.s) + '</p><dl><dt>Works in</dt><dd>' + esc(t.w) + '</dd><dt>Certification</dt><dd class="ph-t">Your certification here</dd><dt>Years in the trade</dt><dd class="ph-t">Your number here</dd></dl></li>'; }).join('');
    tg.setAttribute('data-n', p.techs.length);
    sum.textContent = 'Showing the ' + p.label + ' (' + p.bays.length + ' bays, ' + p.techs.length + ' team members, ' + p.loc + ').';
    [].forEach.call(btns, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-p') === k)); });
  }
  [].forEach.call(btns, function (b) { b.addEventListener('click', function () { render(b.getAttribute('data-p')); }); });
})();
