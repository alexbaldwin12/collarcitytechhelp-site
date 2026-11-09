# Self-critique, Bay Nine Auto (example site B, $999 Business tier)

Checked with the built-in browser (a desktop pane emulating 1280x760 and 375x812). The pane renders slowly and uses software WebGL, so smoothness at 60 fps was NOT judged; I checked states after settling. NOT tested: Safari and iOS (3D, canvas, view transitions, dialog), a real touch device, a real screen reader, Lighthouse, a throttled network run, the OS reduced-motion switch (checked by removing the `js` class and reading the CSS), Firefox.

## Design plan (written and reviewed before coding)
Concept: the page is a repair order. Dark bay, work-order paper, one oil-amber. The signature interactions are a real 3D camera flight into the bay and a part-by-part 3D car; the signature detail is an oil dipstick on the right edge whose amber level is your scroll progress; the signature type move is Saira's width axis (the headline tightens from wide to narrow as you scroll the intro).
Tokens: asphalt #0a0b0c, bay floor #121416, chalk #ece8df, steel #9aa2aa, oil amber #f0a83a, work-order paper #e6e1d5, ink #141516, amber-on-paper #7a4a00. Type: Saira (variable weight 100-900 AND width 75-125) for display, Instrument Sans for text, IBM Plex Mono only on printed tickets. Buttons: chamfered "tag" corners. Layout: five different compositions, not one skeleton: pinned full-bleed fly-in; sticky 3D stage + list; paper price board with ruled rows; horizontal estimate track; drawn floor plan; repair-order ticket form.
Reviewed against the brief, the v4 samples and Kettle Point, and changed before building: (1) first idea near-black + a single vermilion accent was dropped (an AI-default pairing); (2) condensed all-caps Big Shoulders was dropped (the anti-template list bans chunky caps); (3) a violet or teal dark base was ruled out (Kettle Point, main site); (4) pill buttons ruled out (main site, Hudson); (5) a cream page with a serif was ruled out (Hudson, Birchwater); (6) numbered 01-06 lists and eyebrow caps were not used; kickers are sentence case with a drawn rule only.
Compared: Hudson (cream, black grotesk, burgundy pill), Ridgeline (light, heavy grotesk, forest green), Birchwater (stone and sage, giant black grotesk), main site (navy, teal, gradient, pills), Kettle Point (violet-ink, Jost + Hanken, lantern glow, squared buttons). None shares a font, palette, button shape, section pattern or motif with this plan.

## Round 1 (after the first full build)
### Alex's wish list
| Wish | Result | Notes |
|---|---|---|
| Moving animations | Yes | Camera flight scrubbed by scroll, headline width and rise, light sweep across the poster, estimate track, price rows, view transitions between pages, dipstick. |
| Go inside the car / the shop | Yes | Fly-in through the door and along the car, then a real driver's-seat look-around in the 3D section. |
| Look around every detail | Mostly | Spin, zoom, six part hotspots, interior, x-ray; a 360 of a real service hall with five hotspots. The engine, suspension and battery are illustrative shapes, not real parts. The 360 is a stand-in hall, one panorama only. |
| Drone-like walk-through | Mostly | True 3D camera movement with parallax (Site A was only a push inside photos). It is pre-rendered along one baked path, and the bay is procedural, so it looks like a clean CG showroom, not a messy real shop. |
| Very advanced, professional, detailed | Yes at the top of every page; plainer lower down | See below. |

### Bugs found while testing and fixed
1. 3D never started: no import map on the page (module "three" not resolved). Added.
2. 360 page showed a squashed "Pannellum 2.5.6" label: pannellum.css was not linked. Added.
3. Hotspot class `.eq` collided with the equipment-card class, so dots rendered 60 px with bars. Renamed to `.eqh`.
4. Hero buttons and the last caption showed twice on desktop: the entry animation used `fill-mode: both` and held opacity over the scroll value (the same bug Site A had). Now `backwards`.
5. Button hover fill leaked below the buttons (translated clipped layer). Replaced with a clip-path transition.
6. The estimate track did not pin: `overflow:hidden` on the parent stops `position:sticky`. Changed to `overflow-x:clip`.
7. A `.plan svg` rule also hit the arrow icon inside a button on the About page (button became a huge amber slab). Scoped to `svg#plan`.
8. Phone: the fly-in was cropped from a landscape frame and looked soft (3x upscale). Rendered a portrait set (480x1040) for phones; poster and frames switch on aspect ratio.
9. Phone: hero buttons duplicated the bottom dock; the last caption's buttons did too. Hidden on phones, the dock is the call to action.
10. Cabin camera first sat in front of the steering wheel. Moved behind it.

### ALEX-TASTE and ANTI-TEMPLATE
Dark, moody, sans, calm, type and image together: yes. Designed moments: the fly-in with scroll-tightening headline, the 3D car, the paper price board. Banned phrases: none found (the FAQ heading "Straight to the point" was changed to "Quick answers" for being close to the banned list). No fake reviews: slots only. Template check: the header/CTA band/footer frame is common; each page body is a different composition.

### First 3 seconds (new requirement)
Captured at about 0.3 s, 1 s and 3 s after navigation at 1280 and at 375 (screenshots in the session, not committed). 0.3 s: the nav, example label and Book/Call buttons are already painted on black while the poster fades up; 1 s: the dusk-lit bay emerges and the headline lines rise from a narrow to a wide cut while a light bar sweeps across; 3 s: a full-bleed 3D-rendered bay with a pale car under the strip lights, a very large Saira headline, one amber button. Poster is 7-10 KB so it paints before anything heavy. Does it make someone say wow? At 375 and 1280 I think yes: nothing on the site or in the samples opens with giant variable-width type over a cinematic CG bay. Honest caveat: I judged from throttled screenshots; the motion at 60 fps on a phone is unverified. The first frame is dark by design; a bright office monitor will show it as moody, which fits Alex's taste but is less flashy than a bright photo.

### Compared with existing work (screenshots at 1280)
Birchwater: light stone page, black giant grotesk, photo block. Hudson: cream page, menu list, burgundy pill. Kettle Point: dark full-bleed lake photo, small type, fixed top bar. Bay Nine: dark CG bay, giant light Saira, amber chamfered buttons, 3D car. Different fonts, palette, button shape and subject.

## $499 starter beside this $999 build (new requirement)
Opened the Birchwater and Hudson one-page samples next to the Bay Nine home page at 1280. A stranger can tell the premium one in under a second: the starter is a calm light page with a photo and a heading; the $999 build opens with full-bleed motion, a 3D scene, a scrubbed flight and a live status chip, then offers a car you can turn and a 360 room, over five different pages. It is obviously the higher tier. The risk is the opposite one: the $999 build is far above a typical $999 delivery, because it leans on assets (a licensed 3D car, rendered frames) a real client would have to provide or pay for. Kettle Point and Bay Nine are closer cousins (dark, full-bleed, scrubbed intro, fixed bar) than the light starters, but they are different in every visible choice.

## Round 2 (after fixes)
### Would a business owner believe this cost $2-3K? Does it look like any existing sample?
Owner believe $2-3K: yes for the first screen, the 3D car, the 360, the price board and the repair-order form; the lower parts of About and the local pages are well built but quieter and closer to a good template than to custom art direction. Looks like an existing sample: no (see comparison). It shares mechanics with Kettle Point (pinned scrub, a 360, a fixed Book bar) because the brief asks for them, not look or layout. Result: first answer yes, second no, so no redesign was triggered.

### Still weak, in order of importance
1. The 3D model licence is unverified (CC BY 4.0 claimed in the three.js project, original page unreachable) and it is a real brand's car. Alex must confirm or swap before anything public. The ToyCar CC0 fallback is a toy.
2. The shop in the fly-in is a CG stage, not a real bay; the 360 is a different real hall. A real client would give us their own bay photos or video.
3. Engine, suspension, battery and fluids are illustrative amber shapes, not parts in the model. Honest labels exist, but a careful visitor will notice.
4. The 3D section takes about 3.1 MB and took 10-15 s to appear in this pane (software WebGL). On a real phone with a GPU it should be faster, but it is unmeasured. It only loads near the section, and the part list works without it.
5. Frames are baked: no live camera control in the intro; on very small phones the portrait set means the sideways view of the car is cut.
6. Only one panorama and one equipment set; "Look inside" is a real interior but has no clickable hotspots.
7. Copy is placeholder-grade in the sample (e.g. the Troy and Albany local pages mention real towns with invented drive details). Real local pages need real streets and the shop's real address.
8. Not tested: see the first paragraph.
