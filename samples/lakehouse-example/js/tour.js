/* Tour page: 360 rooms with Pannellum (loaded only when the viewer is near), plus the gallery lightbox. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, reduce = root.classList.contains('rm');
  var $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };

  var R = {
    living:  { name: 'Living room',    hint: 'Deep sofas, wide boards and a door to the deck',   yaw: 20,  img: 'living',  hot: [['kitchen', 115, -14], ['deck', 35, -12], ['loft', -150, -14]] },
    kitchen: { name: 'Kitchen',        hint: 'Long counter, the table for five, a door out back', yaw: 10, img: 'kitchen', hot: [['deck', 144, -12], ['living', -140, -12]] },
    loft:    { name: 'The loft',       hint: 'Pine roof, two mattresses and two skylights',        yaw: 15, img: 'loft',    hot: [['living', -53, -8], ['deck', 92, -8]] },
    deck:    { name: 'Covered deck',   hint: 'Dinner outside, with the lake in front',            yaw: 15, img: 'deck',    hot: [['dock', 17, -12], ['living', -150, -12]] },
    dock:    { name: 'The dock',       hint: 'Where the day starts',                              yaw: -20, img: 'dock',   hot: [['shore', -70, -14], ['deck', 150, -14]] },
    shore:   { name: 'The point',      hint: 'Rock, reeds and open water',                        yaw: 20, img: 'shore',   hot: [['dock', -90, -25]] }
  };
  var order = ['living', 'kitchen', 'loft', 'deck', 'dock', 'shore'];
  var vr = $('#vr'), v = null, booted = false;
  if (vr) {
    var ul = $('#rooms');
    order.forEach(function (id) {
      var li = d.createElement('li'), b = d.createElement('button');
      b.className = 'room'; b.type = 'button'; b.dataset.id = id;
      b.innerHTML = '<img alt="" width="84" height="46" loading="lazy" src="pano/' + (id === 'kitchen' ? 'kitchen' : R[id].img) + '-thumb.jpg"><span><b></b><small></small></span>';
      $('b', b).textContent = R[id].name; $('small', b).textContent = R[id].hint;
      b.addEventListener('click', function () { if (v) v.loadScene(id); });
      li.appendChild(b); ul.appendChild(li);
    });
    var mark = function (id) {
      $$('.room').forEach(function (b) { b.setAttribute('aria-current', b.dataset.id === id ? 'true' : 'false'); });
      $('#roomName').textContent = R[id].name; $('#roomHint').textContent = R[id].hint;
    };
    var flat = function () { $('#flat').classList.add('on'); vr.style.display = 'none'; };
    var boot = function () {
      if (booted) return; booted = true;
      var s = d.createElement('script'); s.src = 'vendor/pannellum.js';
      s.onload = function () {
        var cfg = { default: { firstScene: 'living', sceneFadeDuration: reduce ? 0 : 800 }, scenes: {} };
        order.forEach(function (id) {
          var r = R[id];
          cfg.scenes[id] = {
            title: r.name, type: 'equirectangular', panorama: 'pano/' + r.img + '.jpg', yaw: r.yaw, pitch: 0, hfov: 100, minHfov: 50, maxHfov: 120, autoLoad: id === 'living', showControls: true,
            hotSpots: r.hot.map(function (h) {
              return { type: 'scene', sceneId: h[0], yaw: h[1], pitch: h[2], cssClass: 'go', createTooltipArgs: h[0],
                createTooltipFunc: function (div, key) {
                  div.setAttribute('tabindex', '0'); div.setAttribute('role', 'button'); div.setAttribute('aria-label', 'Go to ' + R[key].name);
                  var sp = d.createElement('span'); sp.textContent = R[key].name; div.appendChild(sp);
                  div.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); } });
                } };
            })
          };
        });
        try { v = pannellum.viewer('pano', cfg); } catch (e) { flat(); return; }
        v.on('error', flat); v.on('scenechange', mark); v.on('load', function () { vr.classList.add('on'); mark(v.getScene()); }); mark('living');
        if (!reduce) {
          v.on('load', function once() { v.off('load', once); v.startAutoRotate(-2.5); setTimeout(function () { v.stopAutoRotate(); }, 8000); });
          ['mousedown', 'touchstart', 'keydown', 'wheel'].forEach(function (ev) { $('#pano').addEventListener(ev, function () { v.stopAutoRotate(); }, { passive: true, once: true }); });
        }
        var w = $('#wedge'), last = null;
        (function loop() { try { var y = v.getYaw(); if (y !== last) { w.setAttribute('transform', 'rotate(' + y + ' 28 28)'); last = y; } } catch (e) {} requestAnimationFrame(loop); })();
      };
      s.onerror = flat; d.body.appendChild(s);
    };
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); boot(); } }, { rootMargin: '700px 0px' }); io.observe(vr); } else boot();
    try { var cv = d.createElement('canvas'); if (!(cv.getContext('webgl') || cv.getContext('experimental-webgl'))) flat(); } catch (e) { flat(); }
  }

  /* gallery lightbox: native dialog, arrows and Esc, focus returns, view transition where supported */
  var lb = $('#lb'), btns = $$('#mosaic button');
  if (lb && btns.length) {
    var lbimg = $('#lbimg'), lbcap = $('#lbcap'), idx = 0, opener = null, VT = !!d.startViewTransition && !reduce;
    var setImg = function (i) { idx = (i + btns.length) % btns.length; var b = btns[idx]; lbimg.src = b.dataset.lg; lbimg.alt = $('img', b).alt; lbcap.textContent = b.dataset.cap; };
    var open = function (i) {
      opener = btns[i]; var t = $('img', opener);
      var run = function () { setImg(i); if (!lb.open) lb.showModal(); if (VT) { t.style.viewTransitionName = ''; lbimg.style.viewTransitionName = 'lbimg'; } };
      if (VT) { t.style.viewTransitionName = 'lbimg'; d.startViewTransition(run); } else run();
    };
    var close = function () {
      var run = function () { lb.close(); lbimg.style.viewTransitionName = ''; if (VT && opener) $('img', opener).style.viewTransitionName = 'lbimg'; };
      if (VT) { var tr = d.startViewTransition(run); tr.finished.then(function () { if (opener) $('img', opener).style.viewTransitionName = ''; }); } else run();
    };
    btns.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    $('.x', lb).addEventListener('click', close);
    $('.pv', lb).addEventListener('click', function () { setImg(idx - 1); });
    $('.nx', lb).addEventListener('click', function () { setImg(idx + 1); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { setImg(idx - 1); e.preventDefault(); } else if (e.key === 'ArrowRight') { setImg(idx + 1); e.preventDefault(); } });
    lb.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    lb.addEventListener('close', function () { if (opener) opener.focus(); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-in')) close(); });
  }
})();
