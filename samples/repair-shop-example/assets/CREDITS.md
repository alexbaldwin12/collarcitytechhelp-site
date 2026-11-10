# Credits and licences (Bay Nine Auto example site, Case 14 site B)

Everything here is free-licensed. Nothing is paid, nothing is hotlinked, nothing is from a CDN.

| Asset | Source | Licence | Notes |
|---|---|---|---|
| pano/bay.jpg, pano/bay.webp, pano/bay-flat.jpg | "Autoshop 01" HDRI by Oliksiy Yakovlyev, Poly Haven (https://polyhaven.com/a/autoshop_01); tonemapped JPG from api.polyhaven.com/files/autoshop_01, resized to 4096x2048 / 1024x512 and slightly graded | CC0 | A real service hall, used as the example bay. |
| fonts/Saira-100-900.woff2 | Google Fonts, Saira v23 (Omnibus-Type), latin subset, variable weight and width | SIL Open Font License 1.1 | |
| fonts/InstrumentSans-400-700.woff2 | Google Fonts, Instrument Sans v4 (Instrument), latin subset, variable | SIL OFL 1.1 | |
| fonts/IBMPlexMono-400/500.woff2 | Google Fonts, IBM Plex Mono v20 (IBM), latin subset | SIL OFL 1.1 | Used only on printed-ticket details. |
| vendor/gsap.min.js, ScrollTrigger.min.js | GSAP 3.13.0 | GreenSock standard no-charge licence | same files as Kettle Point |
| vendor/lenis.min.js | Lenis 1.3.27 | MIT (vendor/LICENSE-lenis-MIT.txt) | smooth scroll, off for reduced motion and touch |
| vendor/pannellum.js, pannellum.css | Pannellum 2.5.6 | MIT | same pinned copy as the advanced kit |

Video: one real Pexels loop (the home hero, hero-1) listed below; no audio. People appear only small in the stock footage and photos, never in close-up. No logos of real businesses (lettering and logos were removed in the grade).


## Round 1 real media (Nov 9 2026): hero loops (item 3)
Hard rule from Alex: real footage only, no home-made CG. Source: Pexels (licence: Pexels License, https://www.pexels.com/license/ , free for commercial use, no attribution required; credited anyway). All three are by Artem Podrez, one shoot (same shop, same white SUV, a Subaru-type ordinary wagon; badge lettering on the doors and a wall-sign logo were removed in the grade). Downloaded Nov 9 2026 from the Pexels CDN (videos.pexels.com/video-files/<id>/<id>-hd_1920_1080_<fps>fps.mp4); the Pexels pages sit behind a Cloudflare check for scripts, so file URLs were taken from the page links, the page data (creator, title) was read separately.
| Output files (media/) | Source clip | Creator | Source page | Edits |
|---|---|---|---|---|
| hero-1-1920/960.mp4/.webm, hero-1-poster.jpg/.webp, hero-1-poster-960.webp | "A man checking the engine of the car" (id 8986475, 1080p copy of a 4K original) | Artem Podrez (https://www.pexels.com/@artempodrez/) | https://www.pexels.com/video/a-man-checking-the-engine-of-the-car-8986475/ | Trim 5.2-13.2 s (hood open, tech working), 1 s crossfade of tail into head for a seamless 8 s loop, grade to dark asphalt + warm amber (eq, colorbalance, curves, vignette, light grain), door lettering and a wall-poster logo blurred, audio removed |
| hero-2-poster*.webp/.jpg | "Man working at the garage" (id 8987272), Artem Podrez, https://www.pexels.com/video/man-working-at-the-garage-8987272/ | frame only (used in the repair story), same grade as hero-1; the loop itself is not shipped |
| (source of the car-lift still) | "An auto mechanic working" (id 8987070), Artem Podrez, https://www.pexels.com/video/an-auto-mechanic-working-8987070/ | one frame used for img/car/car-lift; no hero-3 files ship |
Encodes: H.264 High MP4 and VP9 WebM, 1920 and 960 wide, 30 fps, GOP 24, no audio, MP4 faststart. hero-1 sizes: 1920 mp4 1.2 MB, webm 1.5 MB; 960 mp4 0.34 MB, webm 0.39 MB. Posters 1920 wide: jpg 180 KB, webp 76 KB. The people are small in frame; the wagon is a Subaru-type ordinary car whose badges and lettering were removed or are not legible.
Build tool (not shipped): ffmpeg 9.0 (imageio-ffmpeg build, libx264/libvpx/libaom).

## Round 1 real media: close-up photos (item 4, Nov 9 2026)
All Pexels, Pexels License (https://www.pexels.com/license/, free commercial use, no attribution needed; credited anyway). Files in img/real/ as <name>-1600.webp and <name>-800.webp/.jpg (five shipped: brakes-rotor, brakes-pads, brakes-worn, tires-worn, tires-new). Photos that no page used (tire changer, dipstick, oil cap, battery, suspension) were deleted. Only edit: resize (Lanczos), WebP q78 / progressive JPG q80; no grade, no retouch. Photographer names come from the Pexels download filenames. Pexels pages are behind a Cloudflare check for scripts, images were fetched from images.pexels.com by photo id.
| Name | Pexels id and page | Photographer | Shows | Alt text to use |
|---|---|---|---|---|
| brakes-rotor | 4022545 https://www.pexels.com/photo/disk-brake-in-car-service-workshop-4022545/ | svjae | cross-drilled rotor, wheel off, car on a lift | "Brake rotor with the wheel removed on a car in a workshop" |
| brakes-pads | 30470930 https://www.pexels.com/photo/automotive-brake-maintenance-in-workshop-30470930/ | Agustin Olmedo | gloved hand at the caliper and pads | "Mechanic's gloved hand checking brake pads at the rotor" |
| brakes-worn | 6870299 https://www.pexels.com/photo/a-close-up-shot-of-a-vehicle-disc-brake-6870299/ | Gustavo Fring | hand at a caliper on a corroded rotor | "Corroded brake rotor and caliper being inspected" |
| tires-worn | 7019611 https://www.pexels.com/photo/a-close-up-photography-of-a-tire-with-pebbles-in-treads-7019611/ | cottonbro studio | worn tread (truck tire) | "Worn tire tread with stones in the grooves" |
| tires-new | 34357290 https://www.pexels.com/photo/close-up-of-car-tire-tread-with-detailed-pattern-34357290/ | introspectivedsgn | car tire tread with deep grooves | "Car tire tread with deep grooves" |
Before/after pairs (honest): NO true same-part licensed pair exists. Two ILLUSTRATIVE pairs use two separate real photos each, on different vehicles: brakes (brakes-worn = corroded rotor, brakes-rotor = new-looking drilled rotor) and tires (tires-worn = worn truck tread, tires-new = new car tread). The slider caption and alt text must say "Illustrative: two different parts, not the same car". Dirty vs clean air filter: no suitable licensed pair was found (Pexels filter photos are new or a hand on an unseen filter), so no filter pair is shipped; do that slider as brakes or tires only.
Rejected for visible brands/faces: oil pour shot 13065690 (Shell and VW logos on the bottle), 37396753 (Nissan grille), 36281957 (face and star badge), 6870311 and other blue-uniform tire shots (faces in close-up), 8986133 (Hankook sidewall text), 4374843 (battery brand text), 13065692 (tester and engine-cover logos), rear shots of the SUV (badge and plate).

## Round 1: item 5 outcome = Option 2 (real photos with hotspots), no 3D car (Nov 9 2026)
No 3D car shipped. Checked without logins: Khronos glTF-Sample-Assets (ToyCar, CarConcept: toy / concept car, already rejected), Poly Haven models (api.polyhaven.com: no car; only "covered_car", a photoscan of a car under a cover, no parts), Kenney/Quaternius (low-poly, would read as a game). Sketchfab downloads need a login and were not attempted. Under Alex's hard rule (nothing that does not pass as a real photograph) the "Turn the car, tap what hurts" picker becomes a real-photo hotspot viewer with a crossfade between angles.
img/car/ holds three angles (960 JPG/WebP, 1920 WebP) of the same ordinary white wagon on a lift, which are graded still frames (no new CG) from the licensed Pexels clips above (Artem Podrez, see hero-1/2/3 rows; Pexels License): car-side (frame of hero-2 at 2.0 s, side view, car lifted), car-hood (frame of hero-1 at 3.0 s, side view, hood open, tech at the engine), car-lift (frame of hero-3 at 2.0 s, front three-quarter side, lifted, smoky back light). Brand lettering and the wall-sign logo were removed (see hero edits). For the undercarriage and parts use img/real/ (brakes-rotor, tires-changer, suspension-underbody, battery, engine-oilcap). Hotspot starting points for item 10 (percent of 1920x1080, car-side): front wheel/brakes about 53,62; rear wheel about 18,64; tires same as wheels; suspension above the front arch about 52,55; engine/oil/battery under the hood on car-hood about 62,40. Honest limits: only three viewpoints, from video stills at 1080p; not an orbit.


## Round 1 (item 8): removal of the Khronos concept car and all CG
Removed Nov 9 2026 under Alex's hard rule (no home-made CG): Khronos "Car Concept" (CC BY 4.0, Eric Chadwick / Darmstadt Graphics Group GmbH) and its Unity Fan CC0 ancestor, the rendered fly-in frames, posters and stills derived from it, three.js, Draco and the CG-derived environment map. No attribution to Khronos remains because nothing derived from it remains on the site.
Hero posters at 960 wide (media/hero-1-poster-960.webp, hero-2-poster-960.webp/.jpg) are resized copies of the existing hero posters (same Pexels source, same grade).
## Motion layer (item 22)
assets/fx.js and assets/fx.css are original code written for this project (line reveals, count-ups, clip reveals, parallax, magnetic buttons, cursor glow, card tilt, drawn icons, hairlines, grain, first-visit intro, page image morph). Techniques are common ones that Codrops (tympanus.net/codrops) also teaches, but no Codrops or other third-party code, image or font is included, so no extra licence applies. GSAP, ScrollTrigger and Lenis (pinned in vendor/, see README) are unchanged.

Picker hotspots (img/car angles) were measured in pixels on the 1440x810 stills in item 24b: side = front hub, front arch, rear wheel; hood = engine bay and rear hub; lifted = front hub, arch, hood, nose, rear hub. The photos show a stand-in car, so the dots mark where each system sits on a car like this.
