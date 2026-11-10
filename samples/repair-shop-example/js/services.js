/* Services page + home extras: price-board rows, estimate track (horizontal scroll), symptom picker. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, RM = root.classList.contains('rm');
  /* price board accordion (all open without JS) */
  [].forEach.call(d.querySelectorAll('.row'), function (r) {
    var b = r.querySelector(':scope > button'); if (!b) return;
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () { var o = r.hasAttribute('data-open'); [].forEach.call(d.querySelectorAll('.row[data-open]'), function (x) { x.removeAttribute('data-open'); x.querySelector(':scope > button').setAttribute('aria-expanded', 'false'); }); if (!o) { r.setAttribute('data-open', ''); b.setAttribute('aria-expanded', 'true'); } });
  });
  if (location.hash) { var t = d.querySelector('.row[data-id="' + location.hash.slice(1) + '"]'); if (t) t.querySelector(':scope > button').click(); }
  /* vehicle class picker: swaps every range on the board (all three classes are in each row's table without JS) */
  var cl = d.querySelectorAll('.cls button[data-c]');
  if (cl.length && d.querySelector('.rv-t[data-a]')) {
    [].forEach.call(cl, function (b) {
      b.addEventListener('click', function () {
        var c = b.getAttribute('data-c');
        [].forEach.call(cl, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        [].forEach.call(d.querySelectorAll('.rv-t[data-' + c + ']'), function (e) { e.textContent = e.getAttribute('data-' + c); });
        [].forEach.call(d.querySelectorAll('.rprice small'), function (e) { e.textContent = 'sample range'; });
      });
    });
  }
  /* symptom picker */
  var sb = d.querySelectorAll('.sym-btns button'), out = d.getElementById('sym-out');
  if (sb.length && out) {
    var S = JSON.parse(d.getElementById('sym-data').textContent);
    [].forEach.call(sb, function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        [].forEach.call(sb, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var s = S[b.getAttribute('data-k')];
        out.innerHTML = '<b>' + s.name + '</b>' + s.text + '<br><a class="btn sm" style="margin-top:14px" href="contact.html?service=' + s.id + '#book">Book ' + s.name.toLowerCase() + '</a> <a class="btn sm ghost" style="margin-top:14px" href="#car" data-part="' + s.id + '">See it on the car</a>';
        var a = out.querySelector('[data-part]'); if (a) a.addEventListener('click', function () { dispatchEvent(new CustomEvent('cc-open-part', { detail: s.id })); });
      });
    });
  }
  /* estimate track: sticky stage, horizontal travel scrubbed by ScrollTrigger */
  var est = d.querySelector('.est'); if (!est || RM || !root.classList.contains('js') || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var pin = est.querySelector('.est-pin'), track = est.querySelector('.est-track'), line = est.querySelector('.est-line');
  function dist() { return Math.max(0, track.scrollWidth - innerWidth + 40); }
  function setH() { est.style.height = (innerHeight + dist()) + 'px'; pin.style.position = 'sticky'; pin.style.top = '0'; }
  setH();
  gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: est, start: 'top top', end: 'bottom bottom', scrub: .4, invalidateOnRefresh: true,
    onUpdate: function (s) { line.style.setProperty('--p', s.progress.toFixed(3)); } } });
  addEventListener('resize', function () { setH(); ScrollTrigger.refresh(); });
})();
