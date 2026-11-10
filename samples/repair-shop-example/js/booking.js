/* Booking and quote flow (demo: no network, nothing stored). Repair variant with a live sample range, fleet variant, ?service= and ?type=fleet prefill. */
(function () {
  'use strict';
  var d = document, form = d.getElementById('ro-form'); if (!form) return;
  var R = JSON.parse(d.getElementById('rng-data').textContent);
  var fsR = d.getElementById('fs-repair'), fsF = d.getElementById('fs-fleet'), out = d.getElementById('est-out'), cls = d.getElementById('f-class'), msg = d.getElementById('form-msg'), note = d.getElementById('prefill-note'), go = d.getElementById('go');
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function kind() { return form.querySelector('input[name=kind]:checked').value; }
  function mode() {
    var f = kind() === 'fleet'; fsR.hidden = f; fsF.hidden = !f; if (f) note.hidden = true;
    go.firstChild.nodeValue = f ? 'Send fleet inquiry ' : 'Send request ';
  }
  function estimate() {
    var ids = [].map.call(form.querySelectorAll('input[name=svc]:checked'), function (i) { return i.value; }).filter(function (v) { return R.svc[v]; });
    var c = cls.value;
    if (!ids.length) { out.textContent = 'Choose a service to see a sample range for your vehicle class.'; return; }
    if (!c) { out.textContent = 'Choose a vehicle class to see a sample range. Not sure? We will place it for you.'; return; }
    var lo = 0, hi = 0, names = [];
    ids.forEach(function (id) { var s = R.svc[id]; lo += s.r[c][0]; hi += s.r[c][1]; names.push(s.n); });
    out.textContent = money(lo) + ' to ' + money(hi) + ' for ' + names.join(', ') + ', ' + R.classes[c] + '. A sample range, not a quote: a technician confirms the figure after inspection.';
  }
  [].forEach.call(form.querySelectorAll('input[name=kind]'), function (r) { r.addEventListener('change', mode); });
  form.addEventListener('change', function (e) { if (e.target.name === 'svc' || e.target === cls) estimate(); });
  var y = d.getElementById('f-year'), cy = new Date().getFullYear() + 1;
  for (var k = cy; k >= 1996; k--) { var o = d.createElement('option'); o.value = o.textContent = k; y.appendChild(o); }
  var qs = new URLSearchParams(location.search), s0 = qs.get('service'), t0 = qs.get('type');
  if (t0 === 'fleet') { form.querySelector('input[name=kind][value=fleet]').checked = true; }
  if (s0) {
    var cb = form.querySelector('input[name=svc][value="' + s0.replace(/[^a-z]/g, '') + '"]');
    if (cb) { cb.checked = true; note.hidden = false; note.textContent = 'Service chosen: ' + cb.nextElementSibling.textContent + '. Add more or change it below.'; }
  }
  // from the estimate builder on the home page: ?service=brakes&class=b&est=299-549 (a service id, a vehicle class and a sample range: no personal data)
  var c0 = (qs.get('class') || '').replace(/[^abc]/g, ''), e0 = /^(\d{1,5})-(\d{1,5})$/.exec(qs.get('est') || '');
  if (c0 && cls.querySelector('option[value="' + c0 + '"]')) cls.value = c0;
  if (e0 && s0 && R.svc[s0.replace(/[^a-z]/g, '')] && c0) {
    note.hidden = false;
    note.textContent = 'From your estimate: ' + R.svc[s0.replace(/[^a-z]/g, '')].n + ', ' + R.classes[c0] + ', sample range ' + money(+e0[1]) + ' to ' + money(+e0[2]) + '. Add your vehicle details and send the request.';
  }
  /* location picker: one location (default) shows a plain line; two or more show a required "Choose a location" select.
     Edit the list in #loc-data to match the real shop. ?locations=2 previews the two-location layout. */
  (function () {
    var ld = d.getElementById('loc-data'), one = d.getElementById('loc-one'), pick = d.getElementById('loc-pick'), sel = d.getElementById('f-loc'); if (!ld || !one) return;
    var cfg = JSON.parse(ld.textContent), list = (qs.get('locations') === '2') ? cfg.sampleTwo : cfg.locations;
    if (list.length >= 2) {
      pick.hidden = false; one.hidden = true; sel.required = true;
      sel.innerHTML = '<option value="">Choose a location</option>' + list.map(function (l) { return '<option value="' + l.id + '">' + l.name + ' (' + l.addr + ')</option>'; }).join('');
    } else { one.innerHTML = '<b>Location</b> ' + list[0].name + ', ' + list[0].addr; }
  })();
  mode(); estimate();
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    msg.textContent = 'Demo only: nothing was sent and nothing was saved. On a real site this ' + (kind() === 'fleet' ? 'inquiry would reach a service advisor, who replies the same business day to set up the account.' : 'request would go to the shop and you would get a call or text back the same business day.');
    msg.focus();
  });
})();
