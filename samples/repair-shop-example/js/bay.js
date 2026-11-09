/* The Bay page: Pannellum 360 of a real service hall, hotspots on equipment. Loads when near the viewport. */
(function () {
  'use strict';
  var d = document, wrap = d.getElementById('pano-wrap'); if (!wrap) return;
  var EQ = JSON.parse(d.getElementById('eq-data').textContent), viewer = null, panel = d.getElementById('eqpanel'), started = false;
  var flat = wrap.querySelector('.pano-flat'), ui = d.getElementById('pano-ui'), note = d.getElementById('pano-note');
  function show(id) {
    var e = EQ.filter(function (x) { return x.id === id; })[0]; if (!e) return;
    panel.hidden = false;
    panel.querySelector('.pb').innerHTML = '<h3>' + e.name + '</h3><p>' + e.text + '</p><a class="btn dark sm" href="' + e.href + '">' + e.cta + '</a>';
    panel.querySelector('.x').focus({ preventScroll: true });
  }
  function init() {
    if (started) return; started = true; note.textContent = 'Loading the 360 view...';
    var s = d.createElement('script'); s.src = 'vendor/pannellum.js';
    s.onload = function () {
      try {
        viewer = pannellum.viewer('pano', {
          type: 'equirectangular', panorama: 'pano/bay.jpg', autoLoad: true, yaw: -120, pitch: -4, hfov: 100, minHfov: 45, maxHfov: 120, showControls: true, showFullscreenCtrl: true, compass: false,
          hotSpotDebug: false, mouseZoom: false, keyboardZoom: true,
          hotSpots: EQ.map(function (e) { return { id: e.id, pitch: e.pitch, yaw: e.yaw, type: 'info', text: e.name, cssClass: 'eqh', clickHandlerFunc: function () { show(e.id); }, createTooltipFunc: function (div, txt) { div.classList.add('eqh'); div.tabIndex = 0; div.setAttribute('role', 'button'); div.setAttribute('aria-label', txt + ': what it does'); var sp = d.createElement('span'); sp.textContent = txt; div.appendChild(sp); div.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); show(e.id); } }); } }; })
        });
        viewer.on('load', function () { flat.style.display = 'none'; note.textContent = 'Drag to look around. Tap a glowing dot to see what that machine does.'; });
        viewer.on('error', function () { note.textContent = 'The 360 view could not load. The flat picture and the equipment list below still work.'; });
      } catch (err) { note.textContent = 'The 360 view needs WebGL. The flat picture and the equipment list below still work.'; }
    };
    s.onerror = function () { note.textContent = 'The 360 view could not load.'; };
    d.head.appendChild(s);
  }
  panel.querySelector('.x').addEventListener('click', function () { panel.hidden = true; });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) panel.hidden = true; });
  [].forEach.call(d.querySelectorAll('[data-look]'), function (b) {
    b.addEventListener('click', function () {
      var e = EQ.filter(function (x) { return x.id === b.getAttribute('data-look'); })[0];
      if (!started) init();
      (function wait() { if (viewer && viewer.getConfig && viewer.getConfig().panorama) { viewer.lookAt(e.pitch, e.yaw, 70, 1400); show(e.id); } else setTimeout(wait, 200); })();
      wrap.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });
  d.getElementById('pano-go').addEventListener('click', init);
  if ('IntersectionObserver' in window) { new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { o.disconnect(); if (!(navigator.connection && navigator.connection.saveData)) init(); else note.textContent = 'Data saver is on. Press Start 360 view to load it (about 0.8 MB).'; } }, { rootMargin: '700px 0px' }).observe(wrap); }
})();
