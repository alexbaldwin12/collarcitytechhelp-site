# Examples section redesign (branch advanced-samples only)

## What it is now (item 23, Nov 9)
- Dark "Two sites you can walk into" section (id `showpieces`) on /index.html, /websites/index.html and /samples/index.html: two equal cards, same height, no offset. Regular samples stay below under "More examples".
- Each card: a real poster (cut from the sites' real hero posters; landscape 960x600 and a portrait 600x750 for phones; AVIF + WebP + JPG, 15-80 KB each, files in assets/showcase/), the label "Example design - not a real client", a lightweight preview, and links.
- Preview: a muted looping clip (640 px wide, MP4 + WebM, 0.09-0.27 MB, made from the sites' real hero loops: Kettle Point cottage and dock, Bay Nine bay). It is fetched only when the card is half on screen, hovered, focused or touched, pauses off screen, and fades in over the poster. Reduced motion or Save-Data: poster only. No JavaScript: poster plus links. The live homepage never loads the heavy 1920 hero files.
- "Step inside" links: Kettle Point goes to /samples/lakehouse-example/tour.html (360 tour); Bay Nine goes to /samples/repair-shop-example/#car (part picker) and /samples/repair-shop-example/the-bay.html (the bay in 360). "Open the full site" goes to each home.
- Note under the cards says the footage and photographs are free stock standing in for a real client's own.
- noindex stays on the samples; sitemap.xml unchanged; nav, prices, phone and other copy unchanged. assets/site.css and site.js untouched.
- Files: assets/showcase.css, assets/showcase.js, assets/showcase/ (posters + clips). .gitignore has an exception for assets/showcase/*.mp4 and *.webm.

## Revert
Remove the `<section class="sec showcase" ...>` block and the showcase.css/js tags from the three pages (restore the old h2 "Sample websites" on the homepage and "Three samples" byline), delete assets/showcase.css, assets/showcase.js and assets/showcase/, drop the .gitignore lines; or `git revert` the commit "fix: item 23".

## History
Before item 23 the cards used a 96-frame canvas scrubber over rendered 3D frames. Those frames were deleted under the no-CG rule and all frame/CG references are gone.
