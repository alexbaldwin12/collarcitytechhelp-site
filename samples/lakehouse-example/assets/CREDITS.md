# Credits for lakehouse-example (Kettle Point, a fictional lake house), version 2

Kettle Point, Little Kettle Lake, Birch Landing and every price, number, address, host detail and policy are made up. Example design for Collar City Tech Help. Not a real client.

## Removed in round 1 (items 17 and 21)
The earlier 360 panoramas and rectilinear views cut from other Poly Haven scenes (wooden_lounge, studio_country_hall, pine_attic, sundowner_deck, shudu_lake, lakeside_dawn, used as the old tour, gallery and statement pictures) were replaced by the real photographs and the six real 360s below; the files were deleted. The earlier three.js-rendered fly-in (96 landscape and 96 portrait frames), the render scene and its water normal map, and every picture rendered from it were home-made CG. They were deleted from the site. Nothing rendered by us ships any more.

## Software shipped with the page (self-hosted in vendor/, no CDN)
- Pannellum 2.5.6, MIT (vendor/PANNELLUM-LICENSE-MIT.txt)
- GSAP 3.13.0 and ScrollTrigger 3.13.0, GreenSock standard no-charge license (vendor/LICENSE-gsap.txt)
- Lenis 1.3.27, MIT (vendor/LICENSE-lenis-MIT.txt)

## Fonts (self-hosted, latin subset woff2, downloaded from Google Fonts, SIL Open Font License 1.1)
- Epilogue (variable, 200-900), https://fonts.google.com/specimen/Epilogue
- Albert Sans (variable, 300-700), https://fonts.google.com/specimen/Albert+Sans
See fonts/FONTS-LICENSE.txt.

## Not used
No audio. Video is one real Pexels loop (the home hero) listed below. No stock people. No reviews, ratings or testimonials. No map embeds (the map is hand-drawn SVG).

## Round 1 real media (Nov 9 2026): Kettle Point, hard rule "zero home-made CG" (item 6)
All Pexels, Pexels License (https://www.pexels.com/license/, free for commercial use, no attribution needed; credited anyway). Videos fetched from the Pexels CDN with file URLs taken from each video page; photos from images.pexels.com by id; photographer names from the Pexels download filenames or page. HONEST LIMIT: these are stock images from DIFFERENT lakes and houses (Pexels has no single-property lake-house shoot). The interior set below is one cabin from one photographer where possible; exterior clips and photos are other places. The page must not claim they are one property, and the sample stays labelled "Example design - not a real client". For a real client, swap in the client's own photos.
### Hero loops (media/, MP4 + WebM, 1920 and 960 wide, no audio, GOP 24, posters JPG/WebP/AVIF)
| Files | Source clip | Creator | Page | Edits |
|---|---|---|---|---|
| hero-2-* (cottage and dock; the home hero loop, shown mirrored) | "A small house sits on the edge of a lake" id 26615619 | IslandHopper X | https://www.pexels.com/video/a-small-house-sits-on-the-edge-of-a-lake-26615619/ | 8.4 s loop, graded toward a darker, warmer late-day look (not a real dusk), denoise, no audio. Re-encoded Nov 9 from the saved master (MP4 1.5 MB / 0.37 MB, WebM 1.6 MB / 0.73 MB) |
Shipped: hero-2 video (1920 and 960, MP4 + WebM) and poster (WebP + JPG) are the home hero; the hero-3 poster (boathouse, id 26569076, IslandHopper X, https://www.pexels.com/video/a-house-sits-on-the-edge-of-a-lake-26569076/) is a walk-in still. The earlier dusk-lake loop (id 38663537, Mytho Digital) and the winter loop were dropped (a fish-farm raft was in frame) and their files deleted.
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
The four Bertelli Fotografia interiors (hearth bedroom, stone bedroom, kitchens, dining) are one cabin, one shoot. Season variants: summer (hero-2, ext-summer-aerial), fall (ext-autumn-dock), winter (ext-winter-*), dawn (ext-dawn-dock), dusk (ext-dusk-cabin), night (ext-night-lodge). Rejected: clips of tiny houses behind modern lakes with identifiable boats/brands, fish-farm and city lake clips, portrait-only winter clips, photos with brand signs.

## Round 1: real 360 interiors (item 7, Nov 9 2026)
Real equirectangular photographs from Poly Haven, CC0 (public domain, https://polyhaven.com/license). Source: api.polyhaven.com/files/<id> "tonemapped" JPG (8192x4096), resized to 3584x1792 (q72, progressive), 2048x1024 for phones (-2048), 512x256 thumbs (-thumb). Files pano/real-<name>(.jpg | -2048.jpg | -thumb.jpg). Only edit: lythwood_lounge got a small white-balance correction (less yellow). HONEST LIMIT: five different real buildings (a South African country house, a lodge, a wooden hall, a glasshouse, a hotel suite), chosen for wood, warm light and residential feel; they are not one house, so the tour page must keep its sample label and never say they are Kettle Point.
| File | Poly Haven asset (page) | Author | Look |
|---|---|---|---|
| real-loft | pine_attic https://polyhaven.com/a/pine_attic | per asset page | pine-lined attic room, skylights |
| real-bedroom | lythwood_room https://polyhaven.com/a/lythwood_room | per asset page | bedroom with fireplace and window |
| real-sitting | lythwood_lounge https://polyhaven.com/a/lythwood_lounge | per asset page | warm sitting room |
| real-suite | relax_inn_seaview_suite https://polyhaven.com/a/relax_inn_seaview_suite | per asset page | bedroom with balcony |
Sizes: 3584 files 403-859 KB, 2048 files 150-280 KB, thumbs 16-25 KB. Hotspot yaw/pitch were placed in item 21 by looking at each panorama (rings sit on doorways and openings); the tour is wired to all five and the old pano/ files were deleted.

## Round 1: item 17-21 additions (Nov 9 2026)
- Derived images only (no new sources): img/real/*-560.webp (statement pictures) and *-g.webp (gallery thumbnails) are downscaled copies of the Pexels photos above; the kept 1200/2400 WebP files are the photographs themselves, resized. All other img/real JPG and unused WebP files were deleted.
- Home walk-in stills: hero-2 poster (cottage and dock, IslandHopper X, also the hero), ext-dusk-cabin (Cara Denison), hero-3 poster (boathouse, IslandHopper X), in-living-dusk (April Choitz). Season switcher: ext-summer-aerial, ext-autumn-dock, ext-winter-lake. Room-by-room story: in-living-dusk, in-kitchen-wood, in-dining, in-hearth-bedroom, in-bedroom-wood. Gallery: ten of the photographs above.
- Time-of-day grade and the map are CSS and SVG drawn by us (the map is a stylised diagram of a made-up lake, not a photograph).
- Honest limit repeated: every photo, loop and 360 is real but from different places; the pages and the credits page say so.

## Motion layer (item 22)
assets/fx.js and assets/fx.css are original code written for this project (line reveals, count-ups, clip reveals, parallax, magnetic buttons, cursor glow, card tilt, drawn icons, hairlines, grain, first-visit intro, page image morph). Techniques are common ones that Codrops (tympanus.net/codrops) also teaches, but no Codrops or other third-party code, image or font is included, so no extra licence applies. GSAP, ScrollTrigger and Lenis (pinned in vendor/, see README) are unchanged.

## Example-section clip and posters (item 23)
The main site's examples cards use small copies made from the hero loops above: assets/showcase/kettle-* (hero-2 loop, 640 wide, 0.27 MB) and bay-* (Bay Nine hero-1 loop). Same sources, same licences.
