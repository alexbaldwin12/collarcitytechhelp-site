/* Home hero: poster first, then the real footage. WebM then MP4 sources (960 wide on phones and slow links, 1920 otherwise).
   No video under reduced motion or Save-Data (the poster stays). The clip pauses when the hero is off screen or the tab is hidden.
   Real footage only (Pexels, see assets/CREDITS.md). */
(function () {
  'use strict';
  var d = document, root = d.documentElement, hv = d.querySelector('.hv'); if (!hv) return;
  var v = hv.querySelector('video'), img = hv.querySelector('img.m');
  var RM = root.classList.contains('rm'), con = navigator.connection || {}, SD = !!con.saveData;
  if (!v || RM || SD || !window.HTMLVideoElement) return;
  var small = innerWidth <= 900 || /(^|-)(2g|3g)$/.test(con.effectiveType || '');
  var base = v.getAttribute('data-src'), started = false;
  function attach() {
    if (started) return; started = true;
    var w = small ? '960' : '1920', types = [['webm', 'video/webm; codecs="vp9"'], ['mp4', 'video/mp4']];
    types.forEach(function (t) { var s = d.createElement('source'); s.src = base + '-' + w + '.' + t[0]; s.type = t[1]; v.appendChild(s); });
    v.load();
    v.addEventListener('playing', function () { v.classList.add('on'); }, { once: true });
    var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stays */ });
  }
  function go() { setTimeout(attach, 150); }
  function afterPoster() {
    var ready = img && img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    ready.then(function () { if (d.readyState === 'complete') go(); else addEventListener('load', go, { once: true }); });
  }
  afterPoster();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (!started) return; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: 0 }).observe(hv);
  }
  d.addEventListener('visibilitychange', function () { if (!started) return; if (d.hidden) v.pause(); else if (hv.getBoundingClientRect().bottom > 0) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
})();

/* Hero bay board: sample data that ticks like a shop status board. Decorative (aria-hidden); the same story lives on shop.html.
   Only transform and opacity animate. Paused off screen and in hidden tabs. Static under reduced motion. */
(function () {
  'use strict';
  var d = document, bb = d.querySelector('.bb'); if (!bb) return;
  var RM = d.documentElement.classList.contains('rm');
  var lis = [].slice.call(bb.querySelectorAll('li')), tick = bb.querySelector('.bb-tick'), clk = d.getElementById('bbClock');
  var S = [
    [['Brakes', 'Ready 2:30', 'ready'], ['Brakes', 'Road test', 'busy'], ['Oil service', 'In progress', 'busy'], ['Oil service', 'Ready 3:10', 'ready']],
    [['Oil service', 'In progress', 'busy'], ['Oil service', 'Ready 2:05', 'ready'], ['Open', 'Open', 'open'], ['Tires', 'In progress', 'busy']],
    [['Alignment', 'In progress', 'busy'], ['Alignment', 'Ready 2:45', 'ready'], ['Tires', 'Waiting on parts', 'parts'], ['Tires', 'In progress', 'busy']],
    [['Check-engine', 'Diagnosing', 'busy'], ['Check-engine', 'Estimate sent', 'ready'], ['Battery', 'In progress', 'busy'], ['Battery', 'Ready 3:20', 'ready']]
  ];
  var idx = [0, 0, 0, 0], t = 13 * 60 + 52, next = 0, timer = null;
  function fmt(m) { var h = Math.floor(m / 60) % 24, mm = m % 60; return ((h + 11) % 12 + 1) + ':' + (mm < 10 ? '0' : '') + mm + ' ' + (h >= 12 ? 'pm' : 'am'); }
  function swap(box, text) {
    var old = box.firstElementChild; if (old && old.textContent === text) return;
    var n = d.createElement('span'); n.textContent = text; n.className = 'in'; box.appendChild(n);
    requestAnimationFrame(function () { requestAnimationFrame(function () { n.classList.remove('in'); if (old) { old.classList.add('out'); setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 700); } }); });
  }
  function step() {
    var b = next++ % lis.length; idx[b] = (idx[b] + 1) % S[b].length; var s = S[b][idx[b]], li = lis[b];
    swap(li.querySelector('.bb-job'), s[0]); swap(li.querySelector('.bb-st .sw'), s[1]); li.setAttribute('data-k', s[2]);
    t += 1; clk.textContent = fmt(t);
  }
  if (RM) return;
  function run() { if (timer) return; tick.classList.add('run'); timer = setInterval(step, 3400); }
  function halt() { if (timer) { clearInterval(timer); timer = null; } tick.classList.remove('run'); }
  var vis = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !d.hidden) run(); else halt(); }).observe(bb);
  d.addEventListener('visibilitychange', function () { if (d.hidden) halt(); else if (vis) run(); });
  run();
})();
