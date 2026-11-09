# Self-critique, Kettle Point (example site A)

Checked with the built-in browser: 1280 px and 375 px, scrolling the pinned section and reading ScrollTrigger progress, the 360 tour (rail click and keyboard Enter on a ring), lightbox (click, arrows, Esc, focus return), demo form, resource list (zero external requests). Safari was NOT tested (Alex tests later). A real touch device was NOT tested (375 px was emulated in the desktop pane). The pane renders about 1 frame per second, so scrub checks waited for settling instead of judging smoothness; smoothness at 60 fps is unverified.

## Round 1 (after the first build)

### Alex's wish list
| Wish | Result | Notes |
|---|---|---|
| Moving animations | Partly | One pinned scrub, a one-time title rise, hotspot pulse, lightbox view transition. Nothing else moves, on purpose. |
| Go inside the house | Yes, with a catch | The walk goes lake, porch, glass room. The three places are different real locations dissolved together; the end view is a desert mesa, not a lake. Reads as a trailer, not one house. |
| Look around every detail | Partly | Six 360 views, five panoramas. Kitchen corner reuses the glass room panorama. Rooms are stand-ins from different buildings. |
| Drone-like room-by-room walk | Weak | The walk is a push and pan inside photographs (no parallax, no aerial angle). The room-by-room part is hotspot jumps with a fade, not a flythrough between rooms. |
| Very advanced, professional, detailed | Mixed | Top third is strong. Facts, amenities, trust and FAQ were text-only and plain. |

### ALEX-TASTE and ANTI-TEMPLATE-RULES
- Dark, moody, sans, calm, type-led: yes (Jost light at hero scale, violet-ink palette).
- 2-3 crafted moments: the scrubbed walk with a lantern route line and the lantern glow coming on at the door; the hand-drawn contour map; the tour rail with compass. OK.
- One custom detail tied to the house: the lantern (brand mark, route lamp, door glow, map pin). OK.
- Template check: hero, facts list with hairlines, amenities in a 2-column dl, FAQ accordion are common patterns. The facts and amenities blocks were the most template-looking.
- Banned phrases: none found. No eyebrow caps, no numbered markers, no arrows, no middle-dot strings, no fake reviews or ratings.
- Business-first: Check availability and tap-to-call are in the fixed top bar (desktop) and bottom bar (phone), inside the pinned walk, inside the 360 stage, after the facts, map and rates. Found and fixed: on phones the hero buttons duplicated the bottom bar.

### Bugs found while testing (and fixed)
1. Hero fade-out did nothing: the entry animation used `fill-mode: both` and held opacity at 1 over the scroll-driven value. Now `backwards`.
2. Scrub easing was per frame; at low frame rates it lagged. Now time-based.
3. With CSS `scroll-behavior: smooth` the pin broke after a refresh on the phone viewport (start went negative, hero scrolled away). Removed; anchor links glide from JS instead.
4. Mobile hero route block took the desktop width (rule order). Moved after the base rules.
5. `requestIdleCallback(go, 200)` threw (second argument must be an options object). Replaced with a timeout.
6. The top bar sat on top of the example label. Both now live in one fixed header.
7. The cabin sign (Cyrillic) showed in frames. Camera now looks up at the porch; gallery crop moved.

### Compared with existing work (screenshots at 1280)
Compared: samples/hudson-main-kitchen, samples/ridgeline-home-builders, and the main site home page.
- Hudson: cream page, giant black grotesk menu, burgundy pill button. Ridgeline: light page, heavy grotesk, forest green, photo cut-out. Main site: navy blue with teal accent and gradient wash, pill buttons.
- Kettle Point: violet-ink dark, Jost light and Hanken Grotesk (neither used on those pages), lilac-grey and one warm lantern light, full-bleed scrubbed photography, 3 px square buttons. No shared layout, fonts or colors. The earlier first draft used Bricolage + DM Sans (used by existing samples) and a warm amber accent close to Ridgeline's tan; both were replaced before this round.
- Would a business owner believe this cost $2-3K? The first screen, the scroll walk and the tour: yes. The lower half: not yet, it read as a clean but standard page.

## What was added after round 1
Film grain on dark sections; a scroll-scrubbed "light band" (jetty photo that dims to dusk with a lantern glow as you scroll past, with the Check availability button on it); photo in the amenities block; hover caption reveal in the gallery; squared buttons (to stop matching the main site's pills); mobile controls moved clear of the compass; no-JS stills moved into `noscript` so they never download when JS runs.

## Round 2 (after fixes)

Still weak, in order of importance:
1. The walk is not one house. Real fix needs one owner-supplied video or a photo set of one property. With free assets this is the ceiling. A client site would use their own footage.
2. No parallax or true depth in the push-in; zoom-based. A 3D (three.js) scene with a real model would be a different, heavier module.
3. Hotspot jumps between rooms are fades, not travelling shots. Room links were placed by eye and the layout between rooms is invented (e.g. the glass room links to the jetty).
4. Kitchen corner is the same panorama as the glass room; there is no separate kitchen.
5. Lower sections (facts, FAQ, trust) are better but still standard. They are the honest, useful parts for a booking site, and they are readable, but they are not custom-art-directed.
6. Photos are free-licensed and look like different places; colors are graded to match, not identical. The desert-like view out of the glass room clashes with "lake house".
7. Not tested: Safari/iOS (frame canvas, dialog, view transitions, WebGL), real touch scrubbing, 60 fps smoothness, screen reader, Lighthouse. Reduced-motion and no-JS were checked by reading the code paths and the markup, not by switching the OS setting.
8. Weight: 6.6 MB in the folder (limit 12), about 0.4 MB before the load event (limit 1.5). All measured from file sizes and the resource list, not from a throttled network run.

Verdict: strong first screen and tour, honest business sections, different identity from the existing samples. Not at a full $2-3K level through the whole page because of weaknesses 1 to 3, which come from free stock media rather than from layout.
