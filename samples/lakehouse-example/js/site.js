/* Kettle Point example site. No network calls except same-folder images and the two vendored libraries. No storage, no cookies. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var staticMode = reduce || saveData;

  /* ---------- 1. fly-through: scroll scrubs a lazy-loaded frame sequence on canvas ---------- */
  var fly = $("#fly");
  function initFly() {
    var N = 72, W = 1024, H = 576;
    var canvas = $("#seq"), ctx = canvas.getContext("2d", { alpha: false });
    var imgs = new Array(N), ok = new Array(N);
    var shown = -1, target = 0, cur = 0, loaded = 0, readyFired = false;
    var glow = $("#glow"), done = $("#routeDone"), lamp = $("#lamp"), say = $("#say");
    var steps = $$("#route li"), cue = $("#cue"), loadbar = $("#loadbar");
    var title = $("#hero-title"), strap = $("#strap");
    var lines = ["From the water, looking at the shore.", "Up the steps to the porch.", "Through the door, into the glass room."];
    var stop = -1;
    var path = $("#route svg path.track"), plen = path.getTotalLength();

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.round(fly.clientWidth * dpr), h = Math.round(fly.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; shown = -1; }
    }
    function nearest(i) {
      if (ok[i]) return i;
      for (var d = 1; d < N; d++) { if (ok[i - d]) return i - d; if (ok[i + d]) return i + d; }
      return -1;
    }
    function draw(i) {
      var n = nearest(i); if (n < 0 || n === shown) return;
      shown = n;
      var cw = canvas.width, ch = canvas.height, s = Math.max(cw / W, ch / H);
      var dw = W * s, dh = H * s;
      ctx.drawImage(imgs[n], (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }
    function ui(p) {
      var st = p < 0.3 ? 0 : p < 0.68 ? 1 : 2;
      if (st !== stop) {
        stop = st; say.textContent = lines[st];
        steps.forEach(function (li, k) { if (k === st) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current"); });
      }
      done.setAttribute("stroke-dashoffset", String(1 - p));
      var pt = path.getPointAtLength(plen * p); lamp.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")");
      /* the lantern comes on as you step through the door */
      var g = Math.max(0, Math.min(1, (p - 0.62) / 0.3)); glow.style.opacity = (g * g * (3 - 2 * g)).toFixed(3);
      /* title and strap leave as you start moving; the buttons stay put */
      var f = Math.max(0, Math.min(1, (p - 0.02) / 0.14));
      title.style.opacity = strap.style.opacity = (1 - f).toFixed(3);
      title.style.transform = "translateY(" + (-f * 40).toFixed(1) + "px)";
      strap.style.transform = "translateY(" + (-f * 24).toFixed(1) + "px)";
      cue.style.opacity = p > 0.03 ? 0 : 1;
    }
    function tick(time, dt) {
      var k = 1 - Math.exp(-(dt || 16) / 70); /* time-based easing: same feel at any frame rate */
      cur += (target - cur) * k; if (Math.abs(target - cur) < 0.0004) cur = target;
      draw(Math.round(cur * (N - 1)));
      ui(cur);
    }
    function load(i, cb) {
      var im = new Image(); im.decoding = "async";
      im.onload = function () { imgs[i] = im; ok[i] = true; loaded++; if (loadbar) loadbar.style.width = (loaded / N * 100) + "%"; cb(); };
      im.onerror = cb;
      im.src = "frames/f" + (i < 10 ? "00" : "0") + i + ".webp";
    }
    function start() {
      size(); fly.classList.add("live"); draw(0);
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.create({
        trigger: fly, start: "top top",
        end: function () { return "+=" + Math.round(window.innerHeight * (window.innerWidth < 820 ? 3.4 : 4.2)); },
        pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) { target = s.progress; }
      });
      gsap.ticker.add(tick);
      window.addEventListener("resize", size);
    }
    /* load order: a coarse pass (every 8th frame) so scrubbing works early, then the fill. Six at a time. */
    var order = [], i;
    for (i = 0; i < N; i += 8) order.push(i);
    order.push(N - 1);
    for (i = 0; i < N; i++) if (order.indexOf(i) < 0) order.push(i);
    var next = 0, active = 0, coarse = 10;
    function pump() {
      while (active < 6 && next < order.length) {
        (function (idx) {
          active++;
          load(idx, function () {
            active--;
            if (!readyFired && loaded >= coarse) { readyFired = true; start(); }
            if (loaded >= N) fly.classList.add("ready");
            pump();
          });
        })(order[next++]);
      }
    }
    var go = function () { pump(); };
    var later = function () { setTimeout(go, 250); };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later);
  }
  if (staticMode || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("static");
    $("#route").style.display = "none";
    var st = $("#stills");
    [["f000", "Little Kettle Lake from the water", "From the water."], ["f036", "The wooden house from below, with the stair and the porch", "Up to the porch."], ["f071", "Inside the glass room, with a daybed and the view out", "Inside."]].forEach(function (x) {
      var f = document.createElement("figure"), i = new Image(), c = document.createElement("figcaption");
      i.src = "frames/" + x[0] + ".webp"; i.alt = x[1]; i.width = 1024; i.height = 576; i.loading = "lazy"; c.textContent = x[2];
      f.appendChild(i); f.appendChild(c); st.appendChild(f);
    });
    st.hidden = false;
  } else { initFly(); }

  /* the light band: tint and warm glow follow the scroll, image drifts */
  if (!staticMode && window.gsap && window.ScrollTrigger) {
    var trig = { trigger: "#light", start: "top bottom", end: "bottom top", scrub: 0.6 };
    gsap.fromTo("#light img", { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: trig });
    gsap.fromTo("#light .tint", { opacity: 0.1 }, { opacity: 0.8, ease: "none", scrollTrigger: trig });
    gsap.fromTo("#light .warm", { opacity: 0 }, { opacity: 0.85, ease: "power1.in", scrollTrigger: trig });
  } else { var tt = $("#light .tint"); if (tt) tt.style.opacity = ".35"; }

  /* ---------- 2. 360 tour (Pannellum, loaded only when the section is near) ---------- */
  var R = {
    living:  { name: "Glass room",     hint: "Daybeds, the woodstove and the view out",           yaw: -35, img: "living", hot: [["kitchen", 140, -15], ["loft", -118, -22], ["dock", 28, -14]] },
    kitchen: { name: "Kitchen corner", hint: "Gas stove, kettle and the table for five",          yaw: 125, img: "living", hot: [["living", 60, -18], ["bedroom", -170, -12]] },
    loft:    { name: "Loft",           hint: "Two mattresses under a pine roof",                  yaw: 15,  img: "loft",   hot: [["bedroom", 124, -8], ["living", -125, -6]] },
    bedroom: { name: "Bedroom",        hint: "A bed, a desk and the door to the balcony",         yaw: 75,  img: "bedroom", hot: [["dock", 34, -8], ["loft", -176, -8], ["living", 166, -10]] },
    dock:    { name: "Stone jetty",    hint: "Where the day starts. Swim from the end.",          yaw: 18,  img: "dock",   hot: [["shore", -150, -14], ["living", 60, -32]] },
    shore:   { name: "The point",      hint: "Rock, trees and open water",                        yaw: 12,  img: "shore",  hot: [["dock", 115, -26], ["living", -70, -35]] }
  };
  var order = ["living", "kitchen", "loft", "bedroom", "dock", "shore"];
  var vr = $("#vr"), v = null, booted = false;

  function buildRail() {
    var ul = $("#rooms");
    order.forEach(function (id) {
      var li = document.createElement("li"), b = document.createElement("button");
      b.className = "room"; b.type = "button"; b.dataset.id = id;
      var thumb = id === "kitchen" ? "kitchen" : R[id].img;
      b.innerHTML = '<img alt="" width="84" height="46" loading="lazy" src="pano/' + thumb + '-thumb.jpg"><span><b></b><small></small></span>';
      $("b", b).textContent = R[id].name; $("small", b).textContent = R[id].hint;
      b.addEventListener("click", function () { if (v) v.loadScene(id); });
      li.appendChild(b); ul.appendChild(li);
    });
  }
  buildRail();
  function mark(id) {
    $$(".room").forEach(function (b) { b.setAttribute("aria-current", b.dataset.id === id ? "true" : "false"); });
    $("#roomName").textContent = R[id].name; $("#roomHint").textContent = R[id].hint;
  }
  function flat() { $("#flat").classList.add("on"); vr.style.display = "none"; }
  function bootTour() {
    if (booted) return; booted = true;
    var s = document.createElement("script"); s.src = "vendor/pannellum.js";
    s.onload = function () {
      var cfg = { default: { firstScene: "living", sceneFadeDuration: reduce ? 0 : 800 }, scenes: {} };
      order.forEach(function (id) {
        var r = R[id];
        cfg.scenes[id] = {
          title: r.name, type: "equirectangular", panorama: "pano/" + r.img + ".jpg", yaw: r.yaw, pitch: 0, hfov: 100,
          minHfov: 50, maxHfov: 120, autoLoad: id === "living", showControls: true,
          hotSpots: r.hot.map(function (h) {
            return { type: "scene", sceneId: h[0], yaw: h[1], pitch: h[2], cssClass: "go", createTooltipArgs: h[0],
              createTooltipFunc: function (div, key) {
                div.setAttribute("tabindex", "0"); div.setAttribute("role", "button"); div.setAttribute("aria-label", "Go to " + R[key].name);
                var sp = document.createElement("span"); sp.textContent = R[key].name; div.appendChild(sp);
                div.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); div.click(); } });
              } };
          })
        };
      });
      try { v = pannellum.viewer("pano", cfg); } catch (e) { flat(); return; }
      v.on("error", flat);
      v.on("scenechange", mark);
      v.on("load", function () { vr.classList.add("on"); mark(v.getScene()); });
      mark("living");
      if (!reduce) {
        v.on("load", function once() { v.off("load", once); v.startAutoRotate(-2.5); setTimeout(function () { v.stopAutoRotate(); }, 8000); });
        ["mousedown", "touchstart", "keydown", "wheel"].forEach(function (ev) { $("#pano").addEventListener(ev, function () { v.stopAutoRotate(); }, { passive: true, once: true }); });
      }
      var w = $("#wedge"), last = null;
      (function loop() { try { var y = v.getYaw(); if (y !== last) { w.setAttribute("transform", "rotate(" + y + " 28 28)"); last = y; } } catch (e) {} requestAnimationFrame(loop); })();
    };
    s.onerror = flat;
    document.body.appendChild(s);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); bootTour(); } }, { rootMargin: "700px 0px" });
    io.observe(vr);
  } else bootTour();
  /* WebGL check: no WebGL means flat pictures */
  try { var cv = document.createElement("canvas"); if (!(cv.getContext("webgl") || cv.getContext("experimental-webgl"))) flat(); } catch (e) { flat(); }

  /* ---------- 3. gallery lightbox (native dialog, keyboard, view transition where supported) ---------- */
  var lb = $("#lb"), lbimg = $("#lbimg"), lbcap = $("#lbcap"), btns = $$("#mosaic button"), idx = 0, opener = null;
  function setImg(i) {
    idx = (i + btns.length) % btns.length;
    var b = btns[idx]; lbimg.src = b.dataset.lg; lbimg.alt = $("img", b).alt; lbcap.textContent = b.dataset.cap;
  }
  function openLb(i) {
    opener = btns[i]; var t = $("img", opener);
    var run = function () { setImg(i); if (!lb.open) lb.showModal(); if (document.startViewTransition && !reduce) { t.style.viewTransitionName = ""; lbimg.style.viewTransitionName = "lbimg"; } };
    if (document.startViewTransition && !reduce) { t.style.viewTransitionName = "lbimg"; document.startViewTransition(run); } else run();
  }
  function closeLb() {
    var run = function () { lb.close(); lbimg.style.viewTransitionName = ""; if (opener) { var t = $("img", opener); if (document.startViewTransition && !reduce) t.style.viewTransitionName = "lbimg"; } };
    if (document.startViewTransition && !reduce) { var tr = document.startViewTransition(run); tr.finished.then(function () { if (opener) $("img", opener).style.viewTransitionName = ""; }); } else run();
  }
  btns.forEach(function (b, i) { b.addEventListener("click", function () { openLb(i); }); });
  $(".x", lb).addEventListener("click", closeLb);
  $(".pv", lb).addEventListener("click", function () { setImg(idx - 1); });
  $(".nx", lb).addEventListener("click", function () { setImg(idx + 1); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { setImg(idx - 1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { setImg(idx + 1); e.preventDefault(); }
  });
  lb.addEventListener("cancel", function (e) { e.preventDefault(); closeLb(); });
  lb.addEventListener("close", function () { if (opener) opener.focus(); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-in")) closeLb(); });

  /* anchor links glide (JS, so it never fights the pin); reduced motion jumps */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1), el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: y - (id === "top" ? 0 : 0), behavior: reduce ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", "#" + id);
      if (id !== "top") { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
    });
  });

  /* ---------- 4. demo booking form: validates, shows a message, sends nothing ---------- */
  var send = $("#send"), msg = $("#out-msg");
  send.addEventListener("click", function () {
    var f = $("#book"), req = $$("[required]", f), bad = req.filter(function (el) { return !el.value || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value)); });
    if (bad.length) { msg.textContent = "Add your dates, name and a valid email to see the demo message."; bad[0].focus(); return; }
    msg.textContent = "Demo only. Nothing was sent or saved. On a live site this reaches the owner.";
  });
  $("#book").addEventListener("submit", function (e) { e.preventDefault(); });
})();
