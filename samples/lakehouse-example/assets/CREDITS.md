# Credits for lakehouse-example (Kettle Point, a fictional lake house), version 2

Kettle Point, Little Kettle Lake, Birch Landing and every price, number, address, host detail and policy are made up. Example design for Collar City Tech Help. Not a real client.

## Photos (free panoramas, Poly Haven, license CC0 / public domain, https://polyhaven.com/license)
Views were cut from the panoramas by us (rectilinear crops), color-graded and resized. They are different real places picked because they share wood, water and dusk. They are not one house, and the page says so.

| Use | Poly Haven asset | Author |
|---|---|---|
| Living room (tour, gallery, home) | wooden_lounge, https://polyhaven.com/a/wooden_lounge | Greg Zaal |
| Kitchen | studio_country_hall, https://polyhaven.com/a/studio_country_hall | Sergej Majboroda |
| Loft | pine_attic, https://polyhaven.com/a/pine_attic | Sergej Majboroda |
| Covered deck | sundowner_deck, https://polyhaven.com/a/sundowner_deck | Dario Barresi |
| The dock | shudu_lake, https://polyhaven.com/a/shudu_lake | Alex Radosnov |
| The point, and the sky in the 3D scene | lakeside_dawn, https://polyhaven.com/a/lakeside_dawn | Greg Zaal (photography), Jarod Guest (processing) |

The sky panorama used inside the 3D scene had one dead tree retouched out (a gradient fill over a small area).

## The fly-in, the dusk house and the dock pictures (our own 3D scene)
Built with three.js r170 and rendered offline to 96 landscape frames and 96 portrait frames. The scene (water, shoreline, pines, house, porch, dock, canoe, interior) is procedural, made by us from basic shapes and canvas-drawn textures; nothing in it is a downloaded model. The water uses the three.js Water add-on and its water normal map (MIT, from the three.js repository, render time only). The sky behind the scene is the lakeside_dawn panorama above. Only the rendered images are on the site; three.js itself is not shipped.

## Software shipped with the page (self-hosted in vendor/, no CDN)
- Pannellum 2.5.6, MIT (vendor/PANNELLUM-LICENSE-MIT.txt)
- GSAP 3.13.0 and ScrollTrigger 3.13.0, GreenSock standard no-charge license (vendor/LICENSE-gsap.txt)

## Fonts (self-hosted, latin subset woff2, downloaded from Google Fonts, SIL Open Font License 1.1)
- Epilogue (variable, 200-900), https://fonts.google.com/specimen/Epilogue
- Albert Sans (variable, 300-700), https://fonts.google.com/specimen/Albert+Sans
See fonts/FONTS-LICENSE.txt.

## Not used
No video or audio. No stock people. No reviews, ratings or testimonials. No map embeds (the map is hand-drawn SVG).

## Round 1 real media (Nov 9 2026): Kettle Point, hard rule "zero home-made CG" (item 6)
All Pexels, Pexels License (https://www.pexels.com/license/, free for commercial use, no attribution needed; credited anyway). Videos fetched from the Pexels CDN with file URLs taken from each video page; photos from images.pexels.com by id; photographer names from the Pexels download filenames or page. HONEST LIMIT: these are stock images from DIFFERENT lakes and houses (Pexels has no single-property lake-house shoot). The interior set below is one cabin from one photographer where possible; exterior clips and photos are other places. The page must not claim they are one property, and the sample stays labelled "Example design - not a real client". For a real client, swap in the client's own photos.
### Hero loops (media/, MP4 + WebM, 1920 and 960 wide, no audio, GOP 24, posters JPG/WebP/AVIF)
| Files | Source clip | Creator | Page | Edits |
|---|---|---|---|---|
| hero-1-* (dusk lake) | "Serene lake at sunset with floating structures" id 38663537 (shows a floating fish-farm raft, left of frame) | Mytho Digital | https://www.pexels.com/video/serene-lake-at-sunset-with-floating-structures-38663537/ | 6.9 s loop (1 s crossfade tail into head), light grade, vignette, no audio |
| hero-2-* (cottage and dock) | "A small house sits on the edge of a lake" id 26615619 | IslandHopper X | https://www.pexels.com/video/a-small-house-sits-on-the-edge-of-a-lake-26615619/ | 8.4 s loop, graded toward a darker, warmer late-day look (not a real dusk), denoise, no audio |
| hero-3-* (boathouse) | "A house sits on the edge of a lake" id 26569076 | IslandHopper X | https://www.pexels.com/video/a-house-sits-on-the-edge-of-a-lake-26569076/ | same grade and loop as hero-2 |
| winter-* | "Scenic winter lakeside cabin aerial view" id 35002101 | Ahmet Yüksek | https://www.pexels.com/video/scenic-winter-lakeside-cabin-aerial-view-35002101/ | 7.8 s loop, light grade |
Sizes: 1920 mp4 1.4-1.7 MB, 960 mp4 0.36-0.44 MB; WebM 1.8-2.9 MB at 1920 (hero-2 WebM is 2.9 MB, over the 2.5 MB target: serve the MP4 first or use the 960 file), 0.5-0.7 MB at 960. Posters 24-478 KB.
### Photos (img/real/, WebP + JPG, 2400 and 1200 wide, <= 350 KB at 2400 (a 0.45 px blur was applied to seven grainy ones to meet that), resize only otherwise)
| File prefix | Pexels id / page slug | Photographer | Use / alt text |
|---|---|---|---|
| ext-summer-aerial | 15533042 house-at-the-lake | Sujan Shan | summer; "Lake house with a wooden dock seen from above" |
| ext-autumn-dock | 29155405 scenic-lake-view-with-autumn-foliage-and-boats | Calvin Wright | fall; "Wooden dock on a lake with autumn trees" |
| ext-dawn-dock | 35194583 tranquil-lake-at-sunset-with-wooden-dock | Courtney Ra | dawn/dusk; "Calm lake at sunrise with a wooden dock and boathouse" |
| ext-dusk-cabin | 35978646 peaceful-lakeside-cabin-at-twilight | Cara Denison | dusk; "Lit cabin by a lake at twilight" |
| ext-night-lodge | 28271971 a-house-on-a-lake-at-night-with-snow | Eberhard Grossgasteiger | night; "Lit lodge reflected in a lake at night" |
| ext-winter-lake | 36599763 serene-winter-lake-scene-with-snowy-cabin | Mete Bilmez | winter; "Snow-covered house across a lake" |
| ext-winter-hut | 19171739 wooden-cabin-in-the-snow-by-a-lake | Landsmann | winter; "Wooden cabin in snow beside a lake" |
| in-living-dusk | 34701790 cozy-interior-of-cabin-overlooking-lake-at-dusk | April Choitz | living room with lake windows, lamp lit |
| in-fireplace | 36383159 cozy-living-room-with-christmas-decor-and-fireplace (Christmas bunting is in frame) | Matt Barnard | brick fireplace and lake view |
| in-hearth-bedroom | 12513476 rustic-wooden-bedroom | Bertelli Fotografia | wood-lined bedroom with brick fireplace |
| in-bedroom-stone | 7163597 soft-bed-in-rural-house | Bertelli Fotografia | bedroom with stone wall |
| in-kitchen-wood | 9056668 inside-a-wooden-cabin | Bertelli Fotografia | wood kitchen and bar |
| in-kitchen-stairs | 12513481 wooden-interior-of-a-home (portrait) | Bertelli Fotografia | kitchen and stairs |
| in-dining | 7163611 interior-of-kitchen-in-rustic-style-house | Bertelli Fotografia | dining table by a stone wall |
| in-bedroom-wood | 5439495 bedroom-of-a-wooden-house | Michael Gault | wood bedroom with window |
The four Bertelli Fotografia interiors (hearth bedroom, stone bedroom, kitchens, dining) are one cabin, one shoot. Season variants: summer (hero-2/3, ext-summer-aerial), fall (ext-autumn-dock), winter (winter-*, ext-winter-*), dawn (ext-dawn-dock), dusk (hero-1, ext-dusk-cabin), night (ext-night-lodge). Rejected: clips of tiny houses behind modern lakes with identifiable boats/brands, fish-farm and city lake clips, portrait-only winter clips, photos with brand signs.

## Round 1: real 360 interiors (item 7, Nov 9 2026)
Real equirectangular photographs from Poly Haven, CC0 (public domain, https://polyhaven.com/license). Source: api.polyhaven.com/files/<id> "tonemapped" JPG (8192x4096), resized to 3584x1792 (q72, progressive), 2048x1024 for phones (-2048), 512x256 thumbs (-thumb). Files pano/real-<name>(.jpg | -2048.jpg | -thumb.jpg). Only edit: lythwood_lounge got a small white-balance correction (less yellow). HONEST LIMIT: six different real buildings (a South African country house, a lodge, a wooden hall, a glasshouse, a hotel suite), chosen for wood, warm light and residential feel; they are not one house, so the tour page must keep its sample label and never say they are Kettle Point.
| File | Poly Haven asset (page) | Author | Look |
|---|---|---|---|
| real-living | wooden_lounge https://polyhaven.com/a/wooden_lounge | per asset page (Poly Haven contributors) | wood-panelled lounge, sectional sofa |
| real-loft | pine_attic https://polyhaven.com/a/pine_attic | per asset page | pine-lined attic room, skylights |
| real-bedroom | lythwood_room https://polyhaven.com/a/lythwood_room | per asset page | bedroom with fireplace and window |
| real-sitting | lythwood_lounge https://polyhaven.com/a/lythwood_lounge | per asset page | warm sitting room |
| real-openplan | glasshouse_interior https://polyhaven.com/a/glasshouse_interior | Dario Barresi | open plan with bed, dining table, stove, big windows |
| real-suite | relax_inn_seaview_suite https://polyhaven.com/a/relax_inn_seaview_suite | per asset page | bedroom with balcony |
Sizes: 3584 files 403-859 KB, 2048 files 150-280 KB, thumbs 16-25 KB. Hotspot yaw/pitch for the new rooms is NOT placed yet (item 21 builds the tour with these); the old CG-made pano/ files stay until the item 17/21 swap.
