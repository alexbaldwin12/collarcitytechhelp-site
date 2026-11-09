# Bay Nine Auto: advanced example site B (Case 14, $999 Business tier)

Private example for Collar City Tech Help. A made-up auto repair shop. Not a real client, not a real business (the name was invented and not searched for uniqueness). noindex on every page. Branch `advanced-samples` only. Do not merge, push or deploy without Alex. Site A (Kettle Point) was not touched.

Run it: `cd samples/repair-shop-example && python3 -m http.server 8781 --bind 127.0.0.1`, then http://127.0.0.1:8781/ (needs a web server).

## Pages (all carry "Example design - not a real client", noindex, the same nav, the sticky Book/Call bar and AutoRepair JSON-LD)
- index.html: real-footage hero (poster first, then a looping clip of an ordinary car in a real bay) with a live-style bay board, symptom picker, full service range tiles with price ranges, drivers/fleets split, shop teaser, 360 teaser, CTA. (Round 1 items 10-14 add the part picker, estimate builder, before/after sliders and the pinned repair story.)
- services.html: price board for nine service lines with a sample RANGE per vehicle class (compact and sedan, SUV and light truck, luxury/European/diesel; a class switch re-prices every row), maintenance-by-mileage table (four visits x three classes), how an estimate works (horizontal scroll track), warranty strip, local pages, FAQ.
- fleet.html: fleet and commercial accounts: six account features, sample labor rates and volume tiers, how an account runs, capacity, FAQ, link to the fleet inquiry.
- shop.html: bay board (lift names, jobs, equipment, sample statuses) and technician roster (role, specialty, bays, certification placeholders), with a size switch that re-renders the same page as a 2-bay independent, a 9-bay shop or a 12-bay, two-location operation.
- the-bay.html: 360 view of a service hall (Pannellum) with 5 equipment hotspots and a text list.
- about.html: story slot, drawn floor plan of nine bays (tap a bay), warranty terms (covered, not covered, claims), certification placeholders, "Your reviews here" slot (no reviews invented), team slot.
- contact.html: booking and quote flow (demo: no network, nothing stored, `form-action 'none'`): repair variant (service picker, vehicle year/make/model/class, drop-off, wait or pickup, preferred day, a live sample range) and fleet-inquiry variant (company, fleet size, vehicle types, services, billing); `?service=<id>` and `?type=fleet` prefill. Tap-to-call, live open/closed status, hours table, drawn SVG map, FAQ.
- brake-repair-troy.html, oil-change-albany.html: sample local SEO pages (own H1, range table, FAQ, map, Service + BreadcrumbList JSON-LD).
Page transitions: CSS cross-document view transitions (`@view-transition`, Chromium); other browsers get a plain page load.

## Scaling the shop (2 bays or 12): how the config works
The pages are generated from one script (scratch tool, output is what is committed). At the top of it is a SHOP CONFIG block: `SERV` (services: name, covers, time, range per vehicle class, whether it appears in the 3D parts list), `PLANS` (maintenance visits), `BAYS_2 / BAYS_9 / BAYS_12` and `TECHS_2 / TECHS_9 / TECHS_12`, `FLEET_*` (programs, rates, tiers), `HOURS`, `CLASSES`. To scale down: use the `*_2` lists (or delete entries), drop fleet.html and its nav link if the shop does no fleet work, and remove services you do not offer; the service tiles, price board, booking checklist, JSON-LD and symptom picker all follow `SERV`. To scale up: add entries; bays named "Location &middot; Bay name" are grouped under a location heading automatically; add location addresses to the footer and contact page. shop.html ships the 9-bay board as static HTML (works with JavaScript off) and carries all three presets as JSON for the size switch (js/shop.js); on a real site you would keep only the one that fits. Technician names, photos and certifications are placeholders on purpose.

## Weights
Before the load event on the home page: html 31 KB, css 43 KB, Saira 99 KB, Instrument Sans 57 KB, two small mono fonts 20 KB, poster 6-8 KB, GSAP 72 KB, ScrollTrigger 44 KB, page scripts about 22 KB: roughly 0.40 MB uncompressed, 13 requests (limit 1.5 MB). Then, lazy: fly-in frames 1.55 MB landscape or 0.92 MB portrait (starts 250 ms after load), 3D about 2.7 MB (three 0.68 MB, addons 0.19, Draco 0.75, model 1.24, env 0.06) only near the 3D section, 360 photo 0.75 MB only on the-bay.html when near. shop.js (2 KB) and booking.js (3 KB) load only on their pages. Measured from file sizes, not from a throttled network run.

## Library review log (read Nov 9 2026)
| File | Version | Licence | sha256 | Review |
|---|---|---|---|---|
| vendor/gsap.min.js, ScrollTrigger.min.js | 3.13.0 | GreenSock standard no-charge | 96c01b81f44a3290e2b4532f55e2c9534b2adc43273a19f3756b2cb41f0fd0b6, 308219390e5e3b84cda0c481e70caa9820883ae10bda44e6e9a149a81aac4b3f | Same files already reviewed for Site A. |
| vendor/pannellum.js, pannellum.css | 2.5.6 | MIT | a28b2f7b339fd0a602c6769df1dca6ad43af73bc8c6a5be67209715289c12a9a, a7f1d7b86f1068f228d92f1b0aef95bd41d1e2e12785516573adbf552ee2793d | Same pinned copy as the advanced kit (reviewed there). |
| fonts/*.woff2 | Google Fonts | OFL 1.1 | Saira e59235a4..., Instrument Sans 19f8ec32..., Plex Mono c36f509c... / a76f53ca... | Font files. |

Not used on purpose: Lenis (native scroll keeps touch reliable), model-viewer, Lottie.
The page CSP (meta tag) allows only same-folder files, blob workers for Draco, no form posts, no frames; the demo form also has no action.

## Rules checks
- check_site.py: `python3 00-hq/tools/check_site.py <worktree root>` run from collar-city (script unchanged): RESULT PASS, 73 pages checked, only "not in sitemap" warnings (unlisted noindex samples). The example phone is written (555) 010-0177 with non-breaking hyphens in the markup (the script reads US-style numbers as errors) and tel:+15550100177.
- Step 2 pages (fleet, shop, booking): checked at 375 px for horizontal overflow (none), with the booking form both variants, the class switch and the size switch driven in the built-in browser; for JavaScript off, by reading the markup and CSS (not by switching it off in a browser): the static 9-bay board, every price table, the open price-board rows and both form variants are meant to show.
- Reduced motion: no scrub, no pin, no auto-rotate, no reveal animation, four stills; checked by CSS/JS path and by removing the js class, not by toggling the OS setting.
- JavaScript off: all text, price board open, parts list with slips, hours table, flat 360 photo, stills, FAQ, form markup.

## Round 1 fixes: smooth scroll (item 2, Nov 9 2026)
| File | Version | Licence | sha256 | Review |
|---|---|---|---|---|
| vendor/lenis.min.js | Lenis 1.3.27 (npm lenis@1.3.27, tarball sha512 QIHNH4LIfWyLfgH/5K0aTGZgyFJJ7GfHNcaH/AIgyKjb8gstLh5siNGvrVqz1w5ClLXzOvllBVk7vby8JzUVPQ==, dist/lenis.min.js original sha256 80f53e77f1c13e379fc246d2b5e299188e20bcb2b2fe7ebb13e8e8c7563a6da7; the shipped copy has only the trailing sourceMappingURL comment removed) | MIT (vendor/LICENSE-lenis-MIT.txt) | 07020831fc52c75dc556473f50ddbf993ca65f1b920394ebd04dfd8c1824d952 | Grep of the readable dist/lenis.js and the min file: 0 hits for eval, new Function, XMLHttpRequest, fetch, localStorage, sessionStorage, document.cookie, sendBeacon, WebSocket, indexedDB, document.write, importScripts. Only URLs are two comment links (a damping article, a modulo helper). No dependencies. It only reads wheel/scroll events and sets scroll position. Result: clean. |
| assets/smooth.js | ours, identical in both sites | n/a | 2cee00eb285d8a04e733114676dbb8a67b9398ae86045f40ba5695f7c65b574a | Wires Lenis to GSAP ticker + ScrollTrigger. Off for prefers-reduced-motion (also live if the setting changes), touch-first devices, `?nosmooth`, or missing libraries. Tested in headless Chrome: a 2000 px wheel glides (706 px at 60 ms, 1800 px at 1.5 s), a ScrollTrigger fires, and with reduced motion it stays native (on:false). Not wired into pages yet. Load order: gsap, ScrollTrigger, lenis.min.js, assets/smooth.js. |
| vendor/gsap.min.js, ScrollTrigger.min.js | GSAP / ScrollTrigger 3.13.0, self-hosted in this folder, no CDN; byte-identical in both sites | GreenSock standard no-charge licence | 96c01b81f44a3290e2b4532f55e2c9534b2adc43273a19f3756b2cb41f0fd0b6, 308219390e5e3b84cda0c481e70caa9820883ae10bda44e6e9a149a81aac4b3f | Pinned and confirmed Nov 9 2026. |
Build tool (not shipped): ffmpeg 9.0 static binary from the pip package imageio-ffmpeg (BSD-2 wrapper; ffmpeg build is GPL because it includes libx264), sha256 591260c945d0eef150e3bf82b0ef988bd36a9cecc18ff05d6679617159f0a95e, run from a scratch venv outside the repo.

## Round 1 fixes: real hero video (item 3, Nov 9 2026)
Hero loops live in media/ (hero-1..3, 1920 and 960, MP4 + WebM, poster JPG/WebP/AVIF). Not wired into pages yet (item 8). OVERRULE: the 05-website rule "never commit video or audio to the repo" is overruled by Alex (Nov 9 2026) for the two showpiece sample folders ONLY (samples/repair-shop-example/media/ and samples/lakehouse-example/media/); logged in shared/court-system/library/CASE-LAW.md under the Case 14 overrule. No audio tracks. Credits and rejected sources: assets/CREDITS.md.

## Removal of all home-made CG (item 8, Nov 9 2026)
Hard rule from Alex: zero computer-generated imagery. Deleted from the branch: the Khronos "Car Concept" model (models/car.glb), three.js r170 and its addons, the Draco decoder, the 96/192 rendered fly-in frames (frames/, frames/p/), the posters and stills made from them (img/poster*.webp, img/still-*.webp), the CG-derived reflection map (assets/env.jpg), js/car.js, js/car-ui.js, js/home.js, and the old "Car Concept" credit in every footer. The home hero is now real footage (media/hero-1, Pexels). Remaining imagery: Pexels photos and clips, the Poly Haven Autoshop 01 photograph, drawn SVG diagrams (floor plan, map, bay board and dashboard mocks, which are UI graphics and are labelled as samples).
Note for item 23: the main-site examples cards still point at repair-shop-example/frames/f056.webp (now deleted); they are replaced in item 23.

## Round 1 fixes (items 8-16, Nov 9 2026)
- Hero (js/hero.js): poster shows first (preloaded, 960 wide on phones), then, after the poster decodes and the page has loaded, WebM then MP4 sources are attached (960 on screens up to 900 px or 2G/3G, 1920 otherwise) and the clip fades in once it is playing. Reduced motion and Save-Data keep the poster only. The clip pauses when the hero leaves the screen or the tab is hidden.
- Bay board (hero): sample data, aria-hidden, a sr-only sentence and a "See every bay" link (shop.html) carry the meaning. Ticks every 3.4 s with transform/opacity; static under reduced motion.
- Part picker (js/picker.js, #car): three stills of one car, percent-based hotspots mapped through object-fit: cover (hot-data JSON in index.html), price slips from the old part list, keyboard (arrow keys on the stage, angle buttons, part list) and swipe.
- Estimate builder (js/estimate.js, #estimate): data in #estb-data (same ranges as the price board; line items are fractions that sum to the range). Book this opens contact.html?service=<id>&class=<a|b|c>&est=<lo>-<hi>#book; js/booking.js sets the class, ticks the service and shows the range.
- Before/after (js/compare.js, #compare): native range inputs over clip-path reveals.
- Story (js/story.js, #how): sticky stage with one scrubbed GSAP timeline; CSS stacks the five steps with photos for reduced motion and no-JS.
- Booking location picker: edit #loc-data in contact.html. One entry shows a plain Location line, two or more show a required "Choose a location" select; ?locations=2 previews two locations.
- Fleet (js/fleet.js): Fleet account panel and an HTML dashboard mock (count-ups, bars, meter); all sample data.
- The bay: short header, viewer height = 100svh minus header and heading block.
- All pages load gsap, ScrollTrigger, Lenis and assets/smooth.js (off for reduced motion, touch-first devices, ?nosmooth).
