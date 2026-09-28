# Reference table layout

The shared implementation is `apps/core/noname/ui/compactSeats.js` with geometry
styles in `apps/core/layout/default/compact-seats.css`. Skin installers only
enable their decoration classes; they do not position or scale any seat.

## Reference coordinates

The supplied eight-player, five-player and landlord-view screenshots use a
1920 × 1080 game area. Black video borders and playback controls are excluded.
Portraits are approximately 251 × 353 pixels. Hand cards are 194.4 × 270 pixels;
central played cards are approximately 161 × 223.5 pixels.

There are seven horizontal anchor columns, numbered 0–6 from left to right.
The outside portraits start 16 pixels from either edge at the reference size.
The observer's own portrait always occupies column 6, 12 pixels above the bottom.
The other rows start 12, 80 and 220 pixels from the top.

| Players / view | Relative positions 1 → N−1: (column, top) |
| --- | --- |
| Eight | (6,220), (5,80), (4,12), (3,12), (2,12), (1,80), (0,220) |
| Five | (6,220), (4,12), (2,12), (0,220) |
| Landlord viewing | (4,12), (2,12) |
| Farmer, landlord is next | (4,12), (0,220) |
| Farmer, landlord is previous | (6,220), (2,12) |

The two farmer views retain next/previous ordering. Dead players retain their
slots; living players are not repacked. The landlord relationship comes from
the mode's public landlord pointer, not the order in which DOM nodes load.

Viewport adaptation uses `min(width / 1920, height / 1080)` continuously, without
breakpoints or measuring loaded portraits. Wide viewports add modest symmetric
side margins. The portrait base remains 128 × 180; image aspect ratios are
preserved by the existing skin's artwork fit. Skill marks occupy a horizontal
strip below portraits (above the self portrait), rather than forcing gaps for
external vertical rails.

## First paint and resizing

The core installs the layout when the arena is constructed. New players remain
hidden until their complete frame geometry is committed. The normal player
creation path commits synchronously before returning; dynamically appended
players are handled by the mutation microtask before paint. No animation-frame
position correction or position/size transition is used. Gameplay effects on
portrait children remain available.

Viewport dimensions are updated synchronously, bypassing the old 500ms resize
debounce for table geometry. ResizeObserver handles other container changes.
Board modes (chess and tower defense) retain their board coordinates.

## Verification

`node --test scripts/compact-seats.test.mjs` checks the reference anchors,
landlord/farmer mappings, proportions, containment and one-pixel resize continuity.

`node scripts/compact-seats-browser.mjs` uses real core/skin modules and production
animation rules. It checks the first twelve frames, five UI providers, the
reference player counts and all three landlord views, along with live resizing
and click targets. Output and screenshots are written to `output/compact-seats`.

`node scripts/builtin-ui-responsive-browser.mjs` covers hand folding, scrolling,
selection lift, controls, guidance and character selection/search dialogs.
