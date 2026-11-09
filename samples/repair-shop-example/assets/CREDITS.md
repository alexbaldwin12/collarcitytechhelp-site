# Credits and licences (Bay Nine Auto example site, Case 14 site B)

Everything here is free-licensed. Nothing is paid, nothing is hotlinked, nothing is from a CDN.

| Asset | Source | Licence | Notes |
|---|---|---|---|
| models/coupe.glb (3D car) | "Ferrari 458 Italia" by vicent091036, taken from the three.js examples repo (examples/models/gltf/ferrari.glb, r170 era), credited there to https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6 | CC BY 4.0 as widely stated for this model. **UNVERIFIED by us**: the Sketchfab page was not reachable on Nov 9 2026 (API returned not found), and the three.js repo itself is MIT with no per-file licence file. Alex must confirm the licence before this model is used on any public or client site. Replacement with a verified CC0 model (Khronos ToyCar, CC0) is possible but is a toy. | The model shows a real brand (Ferrari). We call it "the car" on the site and credit the author in the footer. Used as is, recoloured in code, rotated, with Draco compression. |
| frames/*.webp, img/*.webp (fly-in frames and stills) | Rendered by us (three.js, headless capture in a browser) from the model above, a procedural bay we built in code, and the panorama below used as reflection light | Derived works: CC BY 4.0 (model) | 96 frames landscape, 96 portrait. Scripts live outside the repo. |
| pano/bay.jpg, pano/bay-flat.jpg, assets/env.jpg | "Autoshop 01" HDRI by Oliksiy Yakovlyev, Poly Haven (https://polyhaven.com/a/autoshop_01); tonemapped JPG from api.polyhaven.com/files/autoshop_01, resized to 4096x2048 / 1024x512 and slightly graded | CC0 | A real service hall, not this made-up shop, so equipment positions are stand-ins. |
| fonts/Saira-100-900.woff2 | Google Fonts, Saira v23 (Omnibus-Type), latin subset, variable weight and width | SIL Open Font License 1.1 | |
| fonts/InstrumentSans-400-700.woff2 | Google Fonts, Instrument Sans v4 (Instrument), latin subset, variable | SIL OFL 1.1 | |
| fonts/IBMPlexMono-400/500.woff2 | Google Fonts, IBM Plex Mono v20 (IBM), latin subset | SIL OFL 1.1 | Used only on printed-ticket details. |
| vendor/three.module.min.js, three-addons/* | three.js r170 (npm tarball three@0.170.0), GLTFLoader, DRACOLoader, OrbitControls, BufferGeometryUtils | MIT | licence in vendor/THREE-LICENSE-MIT.txt |
| vendor/draco/* | Draco decoder (Google) as shipped in three@0.170.0 examples/jsm/libs/draco/gltf | Apache 2.0 | |
| vendor/gsap.min.js, ScrollTrigger.min.js | GSAP 3.13.0 | GreenSock standard no-charge licence | same files as Site A |
| vendor/pannellum.js, pannellum.css | Pannellum 2.5.6 | MIT | same pinned copy as the advanced kit |

No video or audio anywhere. No photos of people. No logos of real businesses.
