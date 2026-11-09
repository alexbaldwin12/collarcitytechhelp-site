# Kettle Point lake house: advanced example site A, version 2 (Case 14, $999 Business tier)

Private example for Collar City Tech Help. A made-up lake house. Not a real client, not a real place. `noindex, nofollow` on every page. Branch `advanced-samples` only. Do not merge, push or deploy without Alex.

Run it: `cd samples/lakehouse-example && python3 -m http.server 8780 --bind 127.0.0.1`, then http://127.0.0.1:8780/ (needs a web server; the repo root also works at /samples/lakehouse-example/).

## Pages (each has the "Example design - not a real client" strip, noindex, the same nav, the sticky Check availability / Call bar, and JSON-LD)
- index.html: the fly-in (water, dock, path, door, fireplace), weekend tickets from a live-feeling sample calendar, a scroll-scrubbed "one day at the lake" sun arc, rooms, seasons, host CTA.
- stay.html: sleeping plan, an interactive availability calendar with sample total (links to the form with the dates filled in), sample rates, times and terms, inventory.
- tour.html: 360 tour of six rooms (Pannellum), flat-picture fallback, gallery with a keyboard lightbox.
- about.html: host story (example text), house rules, cleaning and safety, "Your reviews here" slot with review-link placeholders.
- contact.html: demo request form (nothing sent or stored, dates prefilled from the link), tap-to-call, live phone-desk status, hand-drawn map, 8-question FAQ.
- area.html: map, sample distances, what to do by season.
- birch-landing-lake-house-rental.html, fall-foliage-weekend-cabin.html, winter-woodstove-getaway.html: sample local and seasonal SEO pages (own H1, price box, FAQ, map, FAQPage and BreadcrumbList JSON-LD).
- credits.html: licenses and the honest note about the sources.
Page transitions: CSS cross-document view transitions (`@view-transition`, Chromium and recent Safari). Other browsers do a plain page load. The header has its own `view-transition-name` so it does not animate.

## How the fly-in works (honest)
Not video, not photos pushed around. A real three.js (r170) 3D scene built for this page: water with reflections, a shoreline, about 500 instanced pines, a wooden house with a porch, lanterns, a dock and a canoe, and a furnished room with a stone fireplace. A virtual camera flies from the water over the dock, up the path, onto the porch, through the open door and into the room, then turns to look back out of the windows. 96 landscape frames (1024x576) and 96 portrait frames (480x1040) were rendered offline in the browser (software WebGL) and saved as WebP. The page draws them on a canvas and scrubs them with GSAP ScrollTrigger over 520 svh of scroll. The scene is procedural and low-poly, so it looks like a stylised CG model, not a photograph. The path is baked: it cannot react to the visitor.
The first paint is a 24 to 35 KB poster, the headline (which stands in the sky and is mirrored, with a rippling SVG displacement filter, in the water) and the Check availability button, all CSS only. Frames start loading 250 ms after `load`, coarse pass first. The ripple filter stops when you scroll past the title.
The render scene, its server and the page generator are not in the repo (kept outside as working files); the frames and every page are.

## Sample data
Availability and rates are computed in the browser from today's date with a fixed rule (about 44 percent of weekends taken, some mid-week nights), so the calendar always looks current. Prices are labeled "Sample prices". Nothing is stored or sent. The form has no action, `form-action 'none'` in the CSP, and its submit handler only prints a message.

## Weights (measured from file sizes, not a throttled network run)
Folder about 7.4 MB (limit 12). Landscape frames 2.6 MB or portrait frames 1.1 MB (a visitor loads one set, after the page paints). Panoramas 3.8 MB (tour page only, near the viewer), gallery images 0.6 MB (lazy), vendor 0.19 MB, fonts 0.07 MB. Home page before the load event: html 16 KB, css 32 KB, two fonts 68 KB, poster 24-35 KB, GSAP 72 KB, ScrollTrigger 44 KB, site.js and home.js 14 KB, about 0.28 MB (limit 1.5 MB).

## Library and asset review log (read Nov 9 2026)
| File | Version | License | sha256 | Review |
|---|---|---|---|---|
| vendor/pannellum.js, pannellum.css | 2.5.6 | MIT | a28b2f7b339fd0a602c6769df1dca6ad43af73bc8c6a5be67209715289c12a9a, a7f1d7b86f1068f228d92f1b0aef95bd41d1e2e12785516573adbf552ee2793d | Same pinned copy as the advanced kit, reviewed there. |
| vendor/gsap.min.js, ScrollTrigger.min.js | 3.13.0 | GreenSock standard no-charge | 96c01b81f44a3290e2b4532f55e2c9534b2adc43273a19f3756b2cb41f0fd0b6, 308219390e5e3b84cda0c481e70caa9820883ae10bda44e6e9a149a81aac4b3f | Grep of the minified files: 0 hits for eval, new Function, XMLHttpRequest, fetch, localStorage, sessionStorage, document.cookie, sendBeacon, WebSocket, document.write, indexedDB, importScripts. Grep review, not line by line. |
| (render only, not shipped) three.module.min.js | r170 | MIT | 08fd7545d13d2c7fb65ab691530a802dafefd638596501854f267d0fb13c39e7 | Same file reviewed for Site B. Used in a local page that talks only to a local upload server. |
| (render only, not shipped) examples/jsm/objects/Water.js | r170 | MIT | 57eccb0c10e5d6c86a4e92a99f53a006c7c66a7fdc3102a0e141dfca3c614594 | Read: pure shader and render-target code, no network. One line was changed locally (reflection strength 0.9 to 0.32) for the render. |
| (render only, not shipped) waternormals.jpg | three.js r170 repo | MIT | add9912b158a4fe9c12421745babe68c44c8af75631ac4837236cb2a03bc373f | Image. |
| fonts/Epilogue-latin-200-900.woff2 | Google Fonts v20 | OFL 1.1 | 1e161eac1dc51f5b6c90ab7d7ea0fed7ca6a8c072c2fdbcba3095370cbb7e6a1 | Font file. |
| fonts/AlbertSans-latin-300-700.woff2 | Google Fonts v4 | OFL 1.1 | acf304385d0648fd9377eff186c269f2802a5311d3ae62dca46683b05c9c2b48 | Font file. |
Not used on purpose: Lenis (native scroll keeps touch scrubbing reliable), model-viewer, Lottie, any shipped 3D.
The page CSP (meta tag) allows only same-folder files, no form posts, no frames.

## Rules checks
- check_site.py: `python3 00-hq/tools/check_site.py <worktree root>` from collar-city, script unchanged: RESULT PASS, only "not in sitemap" warnings (unlisted noindex samples). The example phone is written (555) 010-0142 with non-breaking hyphens in the markup because the script reads US-style numbers as errors, and tel:+15550100142 / "+15550100142" elsewhere.
- Reduced motion: `rm` class set in the head: no scrub, no pin, stills instead, no reveal or ripple, no autorotate, no view-transition animation. Checked by reading the CSS and JS paths, not by switching the OS setting.
- JavaScript off: every page is readable markup; the calendar and tickets say what they need; the tour shows flat panoramas; the home shows the poster and three stills.
