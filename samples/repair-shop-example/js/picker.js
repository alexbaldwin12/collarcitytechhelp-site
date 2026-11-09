/* Part picker: three real photos of one car, crossfaded; glowing hotspots open the same price slips as the list.
   Works without the photos too (the part list is the keyboard and no-JS way in). Hotspot positions are percentages of the 16:9 photo and are
   mapped through object-fit: cover so they stay on the car at any crop. */
(function () {
  'use strict';
  var d = document, stage = d.getElementById('stage'); if (!stage) return;
  var root = d.documentElement, RM = root.classList.contains('rm');
  var parts = [].slice.call(d.querySelectorAll('#parts .part')), HD = JSON.parse(d.getElementById('hot-data').textContent);
  var lays = [].slice.call(stage.querySelectorAll('.lay')), order = lays.map(function (l) { return l.getAttribute('data-a'); }), cur = 'side';
  var hotsBox = d.getElementById('hots'), ui = d.getElementById('stageUi'), btns = [].slice.call(d.querySelectorAll('[data-angle]')), hots = [];
  var FOCUS = { side: [.5, .5], hood: [.62, .5], lift: [.5, .5] }, FOCUS_N = { side: [.28, .5], hood: [.62, .5], lift: [.5, .5] };

  function open(id, fromHot) {
    parts.forEach(function (p) { var on = p.getAttribute('data-id') === id; if (on) p.setAttribute('data-on', ''); else p.removeAttribute('data-on'); p.querySelector('button').setAttribute('aria-expanded', on); });
    hots.forEach(function (h) { h.el.setAttribute('aria-pressed', String(h.id === id)); });
    if (id) { var def = HD.filter(function (x) { return x.id === id; })[0]; if (def && !def.p[cur]) { for (var k = 0; k < order.length; k++) if (def.p[order[k]]) { setAngle(order[k]); break; } } }
    if (id && fromHot !== 'list' && innerWidth <= 900) { var t = d.querySelector('#parts .part[data-on]'); if (t) t.scrollIntoView({ block: 'nearest', behavior: RM ? 'auto' : 'smooth' }); }
  }
  parts.forEach(function (p) {
    var b = p.querySelector('button'); b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () { if (p.hasAttribute('data-on')) { p.removeAttribute('data-on'); b.setAttribute('aria-expanded', 'false'); hots.forEach(function (h) { h.el.setAttribute('aria-pressed', 'false'); }); } else open(p.getAttribute('data-id'), 'list'); });
  });
  if (!root.classList.contains('js')) return;
  ui.hidden = false;

  function place() {
    var cw = stage.clientWidth, ch = stage.clientHeight; if (!cw) return;
    var r = Math.max(cw / 1920, ch / 1080), iw = 1920 * r, ih = 1080 * r, f = ((cw / ch < 1.5 ? FOCUS_N : FOCUS)[cur]) || [.5, .5], ox = (cw - iw) * f[0], oy = (ch - ih) * (f[1]);
    lays.forEach(function (l) { l.firstElementChild.nextElementSibling.style.objectPosition = (f[0] * 100) + '% ' + (f[1] * 100) + '%'; });
    hots.forEach(function (h) {
      var p = h.p[cur]; if (!p) return;
      var x = ox + iw * p[0] / 100, y = oy + ih * p[1] / 100;
      h.el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      h.el.classList.toggle('flip', x > cw * .62);
      h.el.classList.toggle('off', x < 18 || x > cw - 18 || y < 18 || y > ch - 18);
    });
  }
  function build() {
    HD.forEach(function (def) {
      Object.keys(def.p).forEach(function (a) {
        var b = d.createElement('button'); b.type = 'button'; b.className = 'hot'; b.setAttribute('data-a', a); b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-label', def.n + ': show what we do and the price'); b.innerHTML = '<span>' + def.n + '</span>';
        b.addEventListener('click', function (e) { e.stopPropagation(); open(def.id, 'hot'); });
        hotsBox.appendChild(b); hots.push({ id: def.id, a: a, p: def.p, el: b });
      });
    });
    // each hotspot element belongs to one angle; remember its own position
    hots.forEach(function (h) { var own = h.p[h.a]; h.p = {}; h.p[h.a] = own; });
  }
  var busy = 0;
  function setAngle(a) {
    if (a === cur && lays.some(function (l) { return l.classList.contains('on'); })) return;
    var next = lays.filter(function (l) { return l.getAttribute('data-a') === a; })[0]; if (!next) return;
    var img = next.querySelector('img'), tok = ++busy;
    var go = function () {
      if (tok !== busy) return;
      cur = a;
      lays.forEach(function (l) { l.classList.toggle('on', l === next); });
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-angle') === a)); });
      hots.forEach(function (h) { h.el.classList.toggle('show', h.a === a); h.el.tabIndex = h.a === a ? 0 : -1; });
      place();
    };
    img.loading = 'eager';
    (img.decode ? img.decode().catch(function () {}) : Promise.resolve()).then(go);
  }
  build();
  btns.forEach(function (b) { b.addEventListener('click', function () { setAngle(b.getAttribute('data-angle')); }); });
  // keyboard on the stage
  stage.addEventListener('keydown', function (e) {
    if (e.target !== stage) return;
    var i = order.indexOf(cur);
    if (e.key === 'ArrowRight') { setAngle(order[(i + 1) % order.length]); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { setAngle(order[(i + order.length - 1) % order.length]); e.preventDefault(); }
  });
  // drag / swipe sideways
  var sx = null, sy = 0, moved = false;
  stage.addEventListener('pointerdown', function (e) { if (e.target.closest('.hot,.chip')) return; sx = e.clientX; sy = e.clientY; moved = false; });
  addEventListener('pointerup', function (e) {
    if (sx === null) return; var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) { var i = order.indexOf(cur); setAngle(order[(i + (dx < 0 ? 1 : order.length - 1)) % order.length]); }
  });
  addEventListener('pointercancel', function () { sx = null; });
  if ('ResizeObserver' in window) new ResizeObserver(place).observe(stage); else addEventListener('resize', place);
  // the first photo loads when the stage is near the screen; the other two load on the first angle change
  var started = false;
  function start() { if (started) return; started = true; if (!busy) setAngle('side'); }
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: '400px 0px' }); io.observe(stage); } else start();
  var m = /part=(\w+)/.exec(location.search); if (m) open(m[1], 'list');
  addEventListener('cc-open-part', function (e) { open(e.detail, 'list'); });
})();
