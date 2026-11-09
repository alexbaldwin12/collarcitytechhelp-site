/* 3D car section glue: part list (also the keyboard / no-3D way in), service slip, lazy loader for car.js */
(function () {
  'use strict';
  var d = document, stage = d.getElementById('stage3d'); if (!stage) return;
  var parts = [].slice.call(d.querySelectorAll('#parts .part')), api = null, loading = false, ui = d.getElementById('stageUi'), load = d.getElementById('carLoad');
  function open(id, scrollList) {
    parts.forEach(function (p) { var on = p.getAttribute('data-id') === id; if (on) p.setAttribute('data-on', ''); else p.removeAttribute('data-on'); p.querySelector('button').setAttribute('aria-expanded', on); });
    if (api) api.focus(id);
    if (scrollList) { var t = d.querySelector('#parts .part[data-on]'); if (t && innerWidth <= 900) t.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }
  parts.forEach(function (p) {
    var b = p.querySelector('button'); b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () { if (p.hasAttribute('data-on')) { p.removeAttribute('data-on'); b.setAttribute('aria-expanded', 'false'); if (api) api.reset(); } else { open(p.getAttribute('data-id')); if (!api) boot(true); } });
  });
  if (!d.documentElement.classList.contains('js')) return;
  ui.hidden = false;
  function boot(force) {
    if (api || loading) return; loading = true;
    var sd = navigator.connection && navigator.connection.saveData;
    if (sd && !force) { load.innerHTML = '<button class="btn" type="button" id="go3d">Start the 3D view (about 2 MB)</button>'; d.getElementById('go3d').onclick = function () { loading = false; boot(true); }; loading = false; return; }
    load.hidden = false; load.textContent = 'Loading the 3D car...';
    import('./car.js').then(function (m) {
      return m.start(stage, d.getElementById('canvasHost'), d.getElementById('hots'), function (id) { open(id, true); }, function () { stage.querySelector('.ph').style.opacity = 0; load.hidden = true; var c = stage.querySelector('canvas'); if (c) c.classList.add('on'); });
    }).then(function (a) { api = a; var on = d.querySelector('#parts .part[data-on]'); if (on) api.focus(on.getAttribute('data-id')); })
      .catch(function (e) { loading = false; load.hidden = false; load.textContent = '3D could not start on this device. The part list still works.'; if (window.console) console.warn(e); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); boot(false); } }, { rootMargin: '500px 0px' }); io.observe(stage);
  } else boot(false);
  d.getElementById('zin').onclick = function () { api && api.zoom(.8); };
  d.getElementById('zout').onclick = function () { api && api.zoom(1.25); };
  d.getElementById('reset').onclick = function () { if (api) { api.reset(); parts.forEach(function (p) { p.removeAttribute('data-on'); }); xr.setAttribute('aria-pressed', 'false'); cb.setAttribute('aria-pressed', 'false'); } };
  var xr = d.getElementById('xray'), cb = d.getElementById('cabin');
  xr.onclick = function () { if (!api) return; xr.setAttribute('aria-pressed', api.xray()); };
  cb.onclick = function () { if (!api) return; var on = api.cabin(); cb.setAttribute('aria-pressed', on); xr.setAttribute('aria-pressed', 'false'); parts.forEach(function (p) { p.removeAttribute('data-on'); }); };
  // quick-pick from the symptom picker or links: #car?part=brakes
  var m = /part=(\w+)/.exec(location.search); if (m) open(m[1]);
  addEventListener('cc-open-part', function (e) { open(e.detail); });
})();
