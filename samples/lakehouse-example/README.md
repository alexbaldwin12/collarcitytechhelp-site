# Kettle Point lake house: advanced example site A (Case 14)

Private example for Collar City Tech Help. A made-up lake house. Not a real client. noindex. Branch `advanced-samples` only. Do not merge, push or deploy without Alex.

Run it: `cd samples/lakehouse-example && python3 -m http.server 8780 --bind 127.0.0.1`, then open http://127.0.0.1:8780/ (needs a web server).

## What is in it
1. Scroll-driven walk in: pinned section, GSAP ScrollTrigger scrubs a lazy-loaded image sequence (72 WebP frames, 1024x576, about 2.4 MB) drawn on a canvas. Lake, then the house from the path, then through the door into the glass room. The route line, the captions and the lantern glow are tied to the same scroll progress. The first frame is a plain image so the headline, buttons and price paint before anything heavy loads.
2. 360 tour: Pannellum 2.5.6, five panoramas (glass room and kitchen corner share one), thumbnail rail, hotspot rings (Tab to a ring, Enter to go), compass, flat-picture fallback (no JS, no WebGL, or load error). Loads only when the section is within 700 px of the viewport.
2b. Light band: a jetty photo that shifts from day to dusk with the scroll (GSAP scrub, tint and lantern glow), Check availability on top.
3. Gallery with native `<dialog>` lightbox: arrows, Esc, focus returns, View Transitions where supported.
4. Business parts: always-reachable Check availability and tap-to-call (top bar on desktop, bottom bar on phones), sample rates labeled as such, check-in/out, FAQ in details/summary, house rules, cleaning and safety list, host and "Your reviews here" slot (no invented reviews), drawn SVG map with depth contours, demo inquiry form (no action, `form-action 'none'` CSP, nothing is sent or stored), JSON-LD `VacationRental` with example values only.

## How the fly-through was made (honest)
No suitable free footage was found, and ffmpeg is not installed here, so no video was used or stored. The frames are rendered with a small Python script (numpy + Pillow): a virtual pinhole camera moves (yaw, pitch, field of view) through free Poly Haven panoramas and dissolves between three places. It is a camera push and pan inside photographs, not a 3D flight: there is no parallax, and the three places are not one house. The scripts live outside the repo (scratch); the frames are the only output committed.

## Weights (measured with du, and the file list)
Walk-in frames 2.4 MB, panoramas 3.2 MB (loaded only when the tour is reached), gallery 0.9 MB (lazy), vendor 0.19 MB, fonts 0.06 MB. Folder total about 6.6 MB (limit 12). Before the load event the page requests: index.html, css, two fonts, pannellum.css, the first frame, GSAP, ScrollTrigger, site.js, plus six small thumbnails, roughly 0.4 MB in all (limit 1.5). Frames start loading 250 ms after `load`, six at a time, a coarse pass first so scrubbing works early.

## Library review log
| File | Version | License | sha256 | Review (read Nov 9 2026) |
|---|---|---|---|---|
| vendor/pannellum.js | 2.5.6 | MIT | a28b2f7b339fd0a602c6769df1dca6ad43af73bc8c6a5be67209715289c12a9a | Matches the kit's reviewed copy. No eval or new Function, no cookies or storage, no beacons, no external loads; XHR only for the image/config. |
| vendor/pannellum.css | 2.5.6 | MIT | a7f1d7b86f1068f228d92f1b0aef95bd41d1e2e12785516573adbf552ee2793d | CSS only. |
| vendor/gsap.min.js | 3.13.0 | GreenSock standard no-charge | 96c01b81f44a3290e2b4532f55e2c9534b2adc43273a19f3756b2cb41f0fd0b6 | grep of the minified file: 0 hits for eval, new Function, XMLHttpRequest, fetch, localStorage, sessionStorage, document.cookie, sendBeacon, WebSocket, document.write, indexedDB, importScripts. Only URLs in it: w3.org namespaces and gsap.com in the license comment. No dependencies. Same file as samples/kit/vendor. This is a grep review of minified code, not a line-by-line read. |
| vendor/ScrollTrigger.min.js | 3.13.0 | GreenSock standard no-charge | 308219390e5e3b84cda0c481e70caa9820883ae10bda44e6e9a149a81aac4b3f | Same grep, same result. Depends on GSAP core (vendored). |
| fonts/Jost-latin-300-600.woff2 | Google Fonts v20 | OFL 1.1 | 235d8f8964bfdf105fc0c3e4c77b5e70f31bee1dad611d59318b5f2a5cb64d90 | Font file, not code. |
| fonts/HankenGrotesk-latin-400-700.woff2 | Google Fonts v12 | OFL 1.1 | 1f21c6eaa0000f3329cfcfac966b43d5bebf5aa610303e33294ac31bc6f4bb59 | Font file, not code. |

Not used on purpose: Lenis (native scroll keeps touch scrubbing reliable and does not fight the pin), three.js, model-viewer, Lottie (nothing in the brief needed them).

The page also sets a Content-Security-Policy meta tag (same-folder files only, no form posts, no frames), which backs up the "nothing leaves the page" claim in a browser.

## Rules checks
- check_site.py: run as `python3 00-hq/tools/check_site.py <worktree>`. PASS. Two things to know: the script treats a US-style phone number as an error, so the example number is written with non-breaking hyphens (555) 010-0142 and tel:+15550100142 in the markup, and the JSON-LD uses +15550100142. The script was not changed. Sitemap warnings are expected: this page is unlisted and noindex.
- Reduced motion (CSS `prefers-reduced-motion` and the JS check) and data-saver: no frame loading, no scrub, no pin, no autorotate, no animation; three stills show the walk in.
- JavaScript off: everything is readable markup; hero poster, three stills (in noscript), flat panoramas, FAQ, form (inert).
