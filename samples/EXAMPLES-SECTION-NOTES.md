# Examples section redesign (branch advanced-samples only)

## What changed
- New dark "Two sites you can walk into" feature section (id `showpieces`) for the two showpieces: Kettle Point (lake house) and Bay Nine Auto. Poster = an existing fly-in frame (frames/f048 and f056, 11 KB and 26 KB; portrait versions on phones). No new images.
- Preview: after the card is half on screen (or on hover/touch/focus) showcase.js loads every 4th frame (every 6th on phones) from the showpiece's own frames/ folder and loops them slowly, crossfaded on a canvas. Mouse move across the picture scrubs. Reduced motion: no preview, static poster. Save-Data: waits for hover/touch. No JS: poster plus links.
- "Step inside" links: Kettle Point -> /samples/lakehouse-example/tour.html (360 tour); Bay Nine -> /samples/repair-shop-example/#car (3D car). "Open the full site" -> each site's home.
- Every card carries "Example design - not a real client"; a note says the pictures are renders, not photos.
- The three regular samples (swiper/cards) are unchanged and sit below under "More examples".
- Places: /index.html (#showpieces, then #samples), /websites/index.html, /samples/index.html (byline now says Five samples). Nav "Samples", footer "Sample sites" links and llms.txt "Samples" line point to /samples/ and are unchanged. sitemap.xml does not list samples; unchanged.
- New files: assets/showcase.css, assets/showcase.js (loaded only on those three pages). assets/site.css and site.js untouched.

## Revert
Remove the `<section class="sec showcase" ...>` block and the two showcase.css/js tags from the three pages (restore the old h2 "Sample websites" on the homepage, "Three samples" byline), delete the two asset files; or `git revert` the commit.
