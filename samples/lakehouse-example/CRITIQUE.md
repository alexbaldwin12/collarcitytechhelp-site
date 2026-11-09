> Round 1 note (Nov 9 2026): this critique describes version 2 with the home-made 3D fly-in, which Alex ruled out ("zero home-made CG"). The fly-in, rendered images and made 360s were deleted and replaced with real footage, photographs and Poly Haven 360s; read README.md for the current build.

# Self-critique, Kettle Point version 2 ($999 Business tier)

How this was checked: the built-in browser pane at 1280x800 and 375x812, scrolling the pinned fly-in and reading ScrollTrigger and canvas state, clicking the tour rooms and the calendar, the lightbox and the form, plus the resource list (zero external requests). The pane renders about one frame per second, so I judged states after they settled, not smoothness. NOT tested: Safari and iOS, a real phone, 60 fps smoothness, a screen reader, Lighthouse, a throttled network run, Firefox, the OS reduced-motion switch (read from the CSS and JS paths), JavaScript turned off (read from the markup), the look of the cross-document view transition (declared and navigation works, the animation itself was not captured).

## Where version 1 failed (why this is a rebuild)
One page. The fly-through was a push and pan inside photographs, the three places were not one house, and a glass room with a desert view sat in a lake house. Lower sections were competent but plain. Version 2 replaces all of it.

## Round 3: after the rebuild

### Brief checklist
| Requirement | Result |
|---|---|
| Multi-page, consistent nav, sticky Book | 10 pages: home, stay, tour, host, contact, area, three local/seasonal SEO pages, credits. One header with the example strip, nav, live phone-desk status, Call and Check availability. Phones get a bottom bar with Call and Check availability. |
| Page transitions | `@view-transition{navigation:auto}` with a named header. Chromium transitions; others navigate plainly. |
| Live-feeling info | Phone-desk status from the clock (Eastern, 8 am to 8 pm), weekend tickets and a calendar computed from today's date. All labeled sample. |
| FAQ, review links, JSON-LD, label, noindex | FAQ on contact and on every SEO page; review-link placeholders on the host page; JSON-LD (VacationRental on every page, plus FAQPage and BreadcrumbList where they apply); example strip and `noindex, nofollow` on every page. |
| Real 3D fly-in | Yes, a three.js scene rendered to 96 landscape and 96 portrait frames. Water with reflections, dock, path, porch, door, room, fireplace, turn to the windows. True parallax and perspective. |
| One consistent place | Rooms are wood and lake panoramas (lounge, rustic kitchen, pine loft, covered deck, lake platform, dawn point). They are still different buildings. Said plainly on the tour and credits pages. No desert. |
| Lower sections custom | Weekend tickets with perforation notches, a scrubbed sun-arc day that turns to night with a lit house, a calendar that totals a stay and fills the form, a seasons list with a sliding headline, inline photo pills in the opening statement. |

### First 3 seconds: does it make someone say wow, and could it be mistaken for another site?
Captured at about 0.3 s, 1 s and 3 s after navigation, at 1280 and at 375. The pane delays CSS animation starts, so the earliest shots show the poster before the headline arrives.
- 0.3 s: the example strip, bar, Check availability and Call are painted over the poster, a dusk lake with a lit wooden house and its reflection.
- 1 s: same poster, settling slowly; the headline is just starting.
- 3 s at 1280: a very large two-word headline "Kettle Point" standing in the sky above the lit house, mirrored in the lake with a rippling distortion, a line of copy and a live "next open weekend". At 375 the headline stacks in two lines over the house and the mirror ripples below.
Wow? I think yes for a local lodging site: a giant type mirror on a 3D lake at dusk is not something the starter samples or the main site do. Honest limit: the scene is stylised low-poly CG (cone pines, flat shapes), not photographic, and I judged from slowed screenshots.
Mistaken for another site? Compared at 1280 against Birchwater Hair Studio (light, black grotesk heading on a photo), Hudson & Main Kitchen (cream, giant black menu), Ridgeline (light, green), the main site (navy, gradient, pills) and Bay Nine Auto (black bay, amber button, wide Saira type). Not Birchwater, Hudson, Ridgeline or the main site. The closest cousin is Bay Nine: both are dark with a scrubbed 3D fly-in and one warm accent. They differ in type (Epilogue heavy and tight versus Saira wide), palette (blue-black with a pale lantern versus asphalt with amber), scene (lake at dusk versus an indoor bay), and the mirrored-headline device. A visitor who saw both would read them as two builds from the same studio. I do not think they could be mistaken for each other. Kettle Point v1 (violet Jost on a photo hero) is gone.

### $499 against $999, side by side
Opened Birchwater and Hudson (one-page starters) next to Kettle Point at 1280. Starters: one page, a calm light layout, one photo, one button, nothing moves. Kettle Point: full-bleed 3D fly-in with a title that stands in the scene, a fixed bar with live status, a calendar, a tour, local pages. The premium one is obvious in the first screen.
Would a business owner believe this cost $2-3K? The home, stay (calendar) and tour: yes. The host, area and SEO pages: they are clean and useful but plainer, closer to a good $999 template than to a custom build. Also true: the 3D scene and 360 rooms are the sort of asset a real client would have to supply or pay for.

### Weak points found in round 3
1. The 3D look is procedural: cone trees, flat interior, a bright fogged lake through the windows in the last frames.
2. Mobile hero showed the same Check availability twice (hero and bottom bar) and the sub-line overlapped the buttons.
3. The weekend ticket row was clipped at the left edge by scroll snap.
4. In the sun-arc scene the ground block hid the house.
5. The headline touched the fixed bar at 1280x800.
6. The rooms are from different buildings.
7. The reflection uses an animated SVG displacement filter: fine on desktop, heavier on cheap phones.

## Round 4: after fixes

Fixed: hero buttons hidden on phones (the bottom bar carries them) and the sub-line and captions moved clear; ticket row padding and scroll-padding; the day scene redrawn so the house, pines and water show and the windows light at dusk; headline reduced and lowered so it clears the bar; the ripple filter is switched off once you scroll past the title and the animation is removed under reduced motion; `scroll-padding-top` for anchors under the fixed header. Verified: no sideways scroll at 375 on all 9 content pages, the calendar picks nights and totals a sample stay, tour rooms all load with rings, the form shows the demo message, `check_site.py` PASS.

Still weak, in order:
1. The 3D scene is stylised and simple. A real client would supply footage or photos of the property; the same pipeline then renders from a modelled scene or plays a scrubbed video. This is the main gap to a true $3K look.
2. Rooms in the 360 tour are different buildings picked for mood; ring positions were placed by eye and the layout between rooms is invented.
3. Host, area and SEO pages are text-led with a map and a price box; competent, not art-directed.
4. The last fly-in frames look out of windows onto a hazy white lake; the interior is flat-lit.
5. Untested: Safari and iOS (canvas, dialog, view transitions, SVG filters), real touch scrubbing, 60 fps and low-end phone performance of the mirror filter, screen reader, Lighthouse, JS off and the OS reduced-motion switch.
6. The hero is dark by design; on a bright office monitor it reads moody, not flashy.

Verdict: first screen and the home flow clear the Business bar and are clearly different from the starters and from the other samples. The pages behind them are good but not yet at the same level, and the 3D realism is limited by what a procedural scene can show.
