/* Area page: the stylised lake map. The road, trail and shore path draw themselves in when the map scrolls into view (stroke-dashoffset);
   places are buttons (hover, focus, tap) that light their line and fill the caption; the distance list drives the same places.
   Reduced motion and no JS: the lines are simply there. */
(function () {
  'use strict';
  var d = document, RM = d.documentElement.classList.contains('rm');
  var map = d.getElementById('map'), cap = d.getElementById('mapcap'); if (!map || !cap) return;
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var INFO = {
    house: ['Kettle Point', 'The house, on the north-east shore. Thirty steps from the door to the dock, and the dock faces the sunset.'],
    beach: ['Sandy beach', 'A small public beach with shallow water. A nine minute walk on the shore path, flat the whole way (sample).'],
    trail: ['Trailhead', 'Four minutes by car. A two mile loop climbs away from the lake to the falls overlook (sample distances).'],
    falls: ['Falls overlook', 'The end of the trail. Loud in April with the thaw, quiet and cool by August.'],
    launch: ['Public boat launch', 'Seven minutes by car. One launch on the lake, with free parking for trailers.'],
    town: ['Birch Landing', 'The village at the end of County Road 12: a market, gas, and a counter that sells coffee early. Twelve minutes by car.']
  };
  var pois = $$('.poi', map), rts = $$('.rt', map), btns = $$('.drive button');
  function show(id) {
    var info = INFO[id]; if (!info) return;
    pois.forEach(function (p) { var on = p.getAttribute('data-id') === id; p.classList.toggle('on', on); });
    var sel = pois.filter(function (p) { return p.getAttribute('data-id') === id; })[0], line = sel && sel.getAttribute('data-p');
    map.classList.add('has-on');
    rts.forEach(function (r) { r.classList.toggle('hl', r.getAttribute('data-p') === line); });
    btns.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-poi') === id); });
    cap.querySelector('h3').textContent = info[0]; cap.querySelector('p').textContent = info[1];
  }
  pois.forEach(function (p) {
    var id = p.getAttribute('data-id');
    p.addEventListener('click', function () { show(id); });
    p.addEventListener('mouseenter', function () { show(id); });
    p.addEventListener('focus', function () { show(id); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(id); } });
  });
  btns.forEach(function (b) { var id = b.getAttribute('data-poi'); b.addEventListener('click', function () { show(id); }); b.addEventListener('mouseenter', function () { show(id); }); });
  if (RM || !('IntersectionObserver' in window)) { map.classList.add('in'); return; }
  var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { map.classList.add('in'); io.disconnect(); } }, { threshold: 0.35 });
  io.observe(map);
})();
