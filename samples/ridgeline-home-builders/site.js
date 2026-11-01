(function () {
  var r = document.documentElement, b = document.getElementById('mode'), l = document.getElementById('modeLabel');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function dark() { var t = r.getAttribute('data-theme'); return t ? t === 'dark' : mq.matches; }
  function sync() { var d = dark(); b.setAttribute('aria-pressed', d ? 'true' : 'false'); l.textContent = d ? 'Light' : 'Dark'; }
  var q = location.search.match(/theme=(dark|light)/); if (q) r.setAttribute('data-theme', q[1]);
  b.addEventListener('click', function () { r.setAttribute('data-theme', dark() ? 'light' : 'dark'); sync(); });
  if (mq.addEventListener) mq.addEventListener('change', function () { if (!r.getAttribute('data-theme')) sync(); });
  sync();
  var toast, tt;
  document.addEventListener('click', function (e) {
    var s = e.target.closest && e.target.closest('.sample-btn'); if (!s) return;
    if (!toast) { toast = document.createElement('div'); toast.className = 'sample-toast'; toast.setAttribute('role', 'status'); toast.textContent = 'Sample site: this button is just for show'; document.body.appendChild(toast); }
    toast.hidden = false; clearTimeout(tt); tt = setTimeout(function () { toast.hidden = true; }, 3500);
  });
})();
