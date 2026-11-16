# Bonnie Plants pitch deck

Parallel Path's presentation for the Bonnie Plants brand refresh, built as
an HTML deck. Michael Benjamin set the frame and the art direction in Figma
Slides. This folder carries that design into code so the team can build out
the content.

Design source: https://www.figma.com/slides/27XPkKGbIjVwSu1YsQNx1b

## Files

```
index.html             the deck, 81 slides in eight sections
layouts.html           every layout and blank slide, to copy from
assets/css/bonnie.css  colors, type, the frame, the blocks, print
assets/js/deck.js      writes the frame on every slide, runs the slideshow
assets/fonts/          IBM Plex, with its Open Font License
assets/img/            photos and the Parallel Path wordmark
assets/video/          video files small enough to keep in git
```

Nothing here loads from another Parallel Path page or stylesheet, and the
fonts are in the folder. Every path is relative, so the folder runs from
any host, including GitHub Pages, with no build step. Open `index.html` in
a browser to see it.

One slide links out of the folder. On "Everything from this session on
one page", the two rows open `../research/index.html` and
`../proposal/index.html`, the two leave-behinds that sit beside this
folder. Keep the three folders as siblings, or change those two `href`
values.

## Presenting

On a screen at least 900 by 480, the deck shows one slide at a time.

- Next: right or down arrow, Page Down, space, a scroll, or a swipe
- Back: left or up arrow, Page Up
- Home and End jump to the first and last slide
- On a slide that builds in steps, Next shows the next step first and
  Back undoes one
- Click a section name in the strip to jump to that section's first
  slide
- F toggles full screen
- The address ends in the page number, `#12` on page 12, so a link can
  open on any slide. The opening wordmark slide sits ahead of the cover
  and is `#0`.

A presentation clicker that sends arrows or Page Up and Page Down works as
is. On a smaller screen the slides stack as a plain scroll.

Print to PDF gives one slide per page at 16 by 9 inches. Turn on
background graphics in the print dialog.

The deck runs offline, except for embedded video, which needs a
connection. Test it in the room before the pitch.

## How the deck is built

```html
<main class="deck" data-deck data-top="Parallel Path + Bonnie Plants|Brand refresh|November 2026">
  <section class="chapter" data-name="Intros">
    <article class="slide ground-linen"> ... </article>
  </section>
  ...
</main>
```

- **Sections.** Each `.chapter` is one section of the talk. Its
  `data-name` is the name in the strip at the foot of every slide. Rename
  a section there and the strip updates on every slide.
- **The strip's links.** `deck.js` makes each section name in the strip a
  link to that section's first slide. It arrives at step 0, like an
  address, and in the stacked scroll the page scrolls to it. The current
  section's name goes back to that section's first slide. At rest a name
  looks like plain text. Under the pointer or keyboard focus it goes to
  full ink, with no underline. Print shows plain text. On `layouts.html`
  the names stay plain text, since its chapters are not the sections.
- **Slides.** Each `.slide` is one slide. Add one by copying a slide from
  `layouts.html`, or an existing slide, into the right chapter.
- **The frame** (the top line, the section strip, the page number) is
  written by `deck.js`. Never write it into a slide by hand. The top line
  comes from `data-top` on `.deck`. Give a slide `data-frame="none"` to
  leave the frame off, as on the opening wordmark slide.
- **The cover** takes `data-kind="cover"`. It is page 1, shows no number,
  and marks no section in the strip. A slide ahead of it has no number
  and does not push the count.
- **Page numbers** follow the slide's place in the deck, counting from the
  cover. The cover, the last slide, and section slides show no number.
  A section slide, such as Just covered and Up next, takes
  `data-kind="section"`.
- **Grounds.** Every slide takes one ground class: `ground-linen`,
  `ground-night`, `ground-slate`, `ground-teal`, `ground-lime` or
  `ground-coral`. The ground sets the background, the ink, and the color
  that marks the current section in the strip. On a dark ground that mark
  is Lime. Add `mark-ink` to mark it in Linen instead, as on the slides
  with a full-bleed photo.
- **A block under the frame.** When a photo or a color block runs under
  part of the frame, say where with `data-over`, measured in Figma pixels
  from the left edge. `data-over="left 900"` is a block from the left edge
  to 900. `data-over="right 640"` is a block from 640 to the right edge.
  The frame over the block turns Linen. Set `--over-ink` on the slide for
  another color.

## Sizes and positions

Every slide is drawn at 1920 by 1080, the size of the Figma file, and
scales to the screen. One Figma pixel is `var(--u)`. Write any size as
`calc(N * var(--u))`, where N is the pixel value from Figma. Never use
plain `px`, `rem` or `vw` inside a slide, since they do not scale with it.

To place something where it sits in Figma, use `.at` with its Figma
position and size:

```html
<figure class="media at" style="--x: 48; --y: 150; --w: 1180; --h: 664"></figure>
```

Leave out `--w` or `--h` to let it size itself. Content sits between the
top line and the strip, from 100 to 1000 down and 48 in from each side.
`.slide-area` is that box.

- A text box with `--w` wraps at that width. Text meant to stay on one
  line takes `nowrap` and no `--w`.
- A line set flush right takes `from-right` and `--r`, the gap to the
  right edge, in place of `--x`.
- `center` centers text in its box.
- Nothing reflows. When a headline grows by a line, move what sits under
  it by changing its `--y`.

## Type

Class names match the text styles in the Figma file.

| Class | Figma style | Font |
|---|---|---|
| `display-1` to `display-6` | Display 1 to 6 | Plex Serif Light at 216, 168, 136, 104, 68, 42 |
| `quote` | Quote | Plex Serif Light Italic at 136 |
| `lead` | Lead | Plex Sans Medium at 40 |
| `subhead` | Subhead | Plex Sans Medium at 30 |
| `small-heading` | Small Heading | Plex Sans Medium at 20 |
| `body-large` | Body Large | Plex Sans at 36 |
| `body` | Body | Plex Sans at 26 |
| `body-small` | Body Small | Plex Sans at 24 |
| `label` | Label | Plex Sans SemiBold at 12, uppercase |

`muted` sets a line in the ink at 60 percent, for a name under a quote.
For another strength, set `--tone`, as in
`<p class="muted" style="--tone: 35">`.

`in-lime`, `in-linen`, `in-night` and `in-slate` set a whole element in
that color, for a big number on a dark ground or a headline over a photo.

## Colors

| Token | Hex | Brand kit name | Use |
|---|---|---|---|
| `--linen` | #F6EDE6 | Linen | Light ground, ink on dark grounds |
| `--night` | #151515 | Night | Dark ground |
| `--slate` | #233D4D | Cadet | Ink on light grounds, dark ground |
| `--teal` | #3C6E71 | Current | The "From seed to sprout" slides only |
| `--lime` | #C6EB4C | Spring | Accent on dark grounds |
| `--coral` | #E1885E | Coral | Up next slides, the two-thirds image block |
| `--sand` | #D0A684 | Sand | Not used yet |
| `--oat` | #E6DACB | not in the kit | Placeholder blocks and tiles |

## Blocks

Each of these is placed with `.at`.

| Class | What it is |
|---|---|
| `placeholder` | Where an image, chart or screenshot goes once it exists. The label inside, 24 in from the top left, says what belongs there. `is-coral` is the two-thirds block. It runs under the top line, so its label starts 100 down. `is-tint` is for dark and Lime grounds. |
| `photo` | A photo. It fills its box and crops to fit. |
| `crop` | A photo shown through a tighter crop than its box. The `img` inside carries the crop as percentages. |
| `shade` | A dark wash over a photo so type on top stays readable. |
| `rule` | A hairline between rows, 2 thick. `--h: 1.5` makes it finer. `soft` is the lighter one inside a group. `upright` runs top to bottom. |
| `tile` | A flat Oat panel behind a title and a line. |
| `block` | A solid block in the ink color, for a boxed headline. |
| `dot` | A circle in the ink color. `is-coral` makes it Coral. |
| `outline` | A square outline, for a map or a chart area. |
| `ring` | A progress ring, drawn as an inline SVG. `--arc` on the ring sets how much of it shows: 1 is a quarter, 2 a half, 3 three quarters, 4 the whole. |
| `media` | A box for a video. See Photos and video. |
| `row-link` | A row that links to another page. An `<a class="row-link" href="...">` around the row's `rule` and its label, which keep their own `.at` positions. It adds a small angled arrow after the label, and the rule darkens under the pointer or keyboard focus. No underline. Print shows plain text. A click on it does not move the deck. |

To fill a placeholder, replace the whole block with the image and keep its
position:

```html
<!-- Before -->
<div class="placeholder at" style="--x: 1000; --y: 100; --w: 872; --h: 880"><span class="small-heading">Image: casual gardener</span></div>

<!-- After -->
<img class="photo at" src="assets/img/file.jpg" alt="" style="--x: 1000; --y: 100; --w: 872; --h: 880">
```

## Motion

The deck has a small motion layer, meant to go unnoticed. Five moves,
one easing curve, two speeds. A slide with no motion attributes sits
still, exactly as it did before the layer existed.

### The five moves

| Move | What it does | Use it on |
|---|---|---|
| `fade` | Opacity only. | Anything. |
| `rise` | Opacity and a short climb of 12. | Headlines and big stat numbers. |
| `draw` | A line draws along its length. | A `rule`, or a `ring`, whose arc draws. |
| `dim` | Text already on screen drops to 40 percent of the ink. It never disappears. | The thing the next step moves on from. |
| `build` | The children of a group arrive in order, 90ms apart. | Rows, tiles, a set of dots. |

### The attributes

- `data-move="fade"` (or `rise`, `draw`, `dim`) goes on one element.
- `data-build` goes on a group. A group is a plain `<div>` around the
  elements. They keep their own `.at` positions, so wrapping them moves
  nothing. Each child of the group arrives in turn with `fade`, unless
  the child carries its own `data-move`.
- `data-build="step"` holds each child after the first for a Next.
- One move per element. To move several elements as one, wrap them in a
  `<div>` and put the move on that.
- A child of a build can hold elements with moves of their own. They then
  play together in that child's turn, and the child itself stays put. The
  stat rows on Our research so far work this way: in each row the rule
  draws, the number rises and the line fades.

```html
<!-- Rows that arrive one after another -->
<div data-build>
  <div> rule and text of row 1 </div>
  <div> rule and text of row 2 </div>
</div>

<!-- Two steps: the first group is there on arrival and dims when the second lands -->
<div data-build="step">
  <div data-move="dim"> ... </div>
  <div> ... </div>
</div>
```

Moves on a slide play in the order they are written. A build waits one
beat after whatever came before it, and a move written after a build
waits one beat for it to finish. To change what goes first, change the
order in the markup.

### Steps

What a slide shows depends only on its step number.

- Arriving forward, or by an address like `#12`, a slide is at step 0.
  Moves with no step play once. Each Next shows one more step. After the
  last step, Next goes to the following slide.
- Back undoes one step, then goes to the previous slide. That slide
  arrives with every step shown and does not replay.
- Home, End, scroll and swipe follow the same rule as the keys.
- A `dim` element is on screen from its own step and dims one step later.

### Tuning

Every move reads these tokens, at the top of `bonnie.css`. Change the
deck's motion there, not on a slide.

The one exception is a build whose children should each land as a beat
of their own. Set `--move-stagger` on that group, to a token:
`<div data-build style="--move-stagger: var(--move-fast)">`.

| Token | Value | Sets |
|---|---|---|
| `--move-ease` | cubic-bezier(0.22, 0.61, 0.36, 1) | The one curve. An ease-out that never overshoots. |
| `--move-fast` | 500ms | fade, rise, dim, and the beat between a build and what follows |
| `--move-slow` | 800ms | draw |
| `--move-stagger` | 90ms | The gap between the children of a build |
| `--move-travel` | 12 | How far rise climbs, in Figma pixels |
| `--move-dim` | 40 | The percent of the ink a dimmed element keeps |
| `--move-cut` | 300ms | The dissolve between slides. `0ms` is a hard cut. |

### What does not move

- The frame: top line, strip, dot and page number.
- Nothing scales, rotates, blurs, flashes or loops. Opacity leads and
  travel stays small.

### The finished state

The finished slide is what prints. Print and PDF, the stacked scroll on
a small screen, and a page whose script did not run all show every slide
fully built, with nothing dimmed. With the system set to reduce motion,
nothing fades or travels. A step build still steps, each step landing at
once.

### Where it is used

Twelve slides in `index.html` carry motion:

- Cover: the title fades in.
- Our time together: the eight rows build.
- The shift: two steps. From is there on arrival. On Next it dims and To
  arrives.
- From seed to sprout (the centered one): the five words build.
- From seed to sprout (the one with two photos): the five words build,
  then the two photos fade in with their captions, Heritage first.
- What success looks like: three steps, one group each.
- Our research so far: the four stat rows build. In each row the rule
  draws, the number rises and the line fades.
- One process, start to finish: the four rings draw in order.
- Area of opportunity: the two axes draw, then the dots and the open
  space fade in.
- Position, Story, Platform: three steps, one column each.
- Identity system: the six blocks build, in reading order.
- Everything from this session on one page: the three blocks build on a
  slower beat, 500ms apart, so each lands on its own.

In `layouts.html`, Four tiles (10), Rows, one line each (24) and Rows, a
title and a line (25) carry `data-build`, so a copied layout brings it
along. Every other slide is still.

## Layouts

`layouts.html` holds every slide from the Templates and Blank slides rows
of the Figma file, 38 in all, nothing cut. To use one, copy its
`<article>` into a chapter of `index.html`. The number is the page number
shown on the slide and the address, `layouts.html#12`.

1. Headline, top
2. Headline, body and image
3. Headline, bottom, on Night
4. Image left, headline and body, on Night
5. Headline, right, on Lime
6. Headline, body and image, on Lime
7. Big number
8. Quote
9. Full-bleed photo with a line
10. Four tiles
11. Four photos with labels
12. Two-thirds image
13. Small headline
14. Numbered divider
15. Boxed headline
16. Photo divider
17. List with images
18. Team of six
19. Just covered, Up next
20. Collage of 9
21. Collage of 15
22. Video with text beside it
23. Video with a subtitle
24. Rows, one line each
25. Rows, a title and a line

26 to 33 are blanks on Linen, one for each of the eight sections. 34 to
38 are blanks on Slate, Night, Teal, Lime and Coral, in that order.

On `layouts.html` the strip's sections come from `data-sections` on
`.deck`, and `data-section="3"` on a slide marks the third. Both only
work on that page. In `index.html` the chapter a slide sits in decides
which section is marked, so a copied `data-section` does nothing there.
Leave it or delete it. One blank on Linen is enough in the deck for the
same reason.

Some layouts are only in the flow, not in `layouts.html`. Copy them from
`index.html`: the agenda (Our time together), the process step with its
four-step nav, the four rings, the three columns with arrows, the map
(Area of opportunity), the nine-block grid (Position, Story, Platform),
the two mood boards, the six-block grid (Identity system), the three
tiles, the half photo (Where healthy living takes root), the big number
under a headline with a quote (Give customers stories worth sharing),
and the case slide with What we heard, Ideas worth growing and a closing
line (Be the answer when beginners ask).

## Photos and video

Photos go in `assets/img/`. Unsplash downloads keep the filename the site
gives them, like `natalia-blauth-m9lqywOVaNY-unsplash.jpg`. Do not rename
them. The photos in the folder are sized to 2400 on the long edge, 0.6 to
1.5 MB each. Size a new photo the same way before adding it. `deck.js`
decodes the next slide's photos ahead of time.

The photos in the two collages and the two mood boards are stand-ins.
Swap them for the interview captures, the store photos and the mood board
images when those exist.

`.media` is a box for a video or a photo. Empty, it shows a play mark.
Replace the `media-empty` span with the video and it fills the box. A
label inside the span, saying which clip goes there, leaves with it.

```html
<!-- A file -->
<video src="assets/video/clip.mp4" controls playsinline preload="metadata"></video>

<!-- An embed -->
<iframe src="https://player.vimeo.com/video/ID" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
```

GitHub refuses any file over 100 MB, so host long clips on Vimeo or
similar and embed them. A video stops when the deck moves off its slide.
While a video has focus, the arrow keys and space control the video, not
the deck. Click outside it to hand the keys back.

`.media-subtitle` lays a line of text across the bottom of the box. Delete
it when the video carries its own captions.

## Settled decisions

These were decided with the team in Figma. Keep them unless the team
changes them.

- No pills anywhere.
- No small numbers in slide content. The strip's section numbers and the
  page number are part of the frame and stay. Numbers at the size of the
  text around them are fine. Big numbers for stats are good.
- Color goes on whole elements, never on one word in a line.
- Italics only for quotes.
- Lime only on dark grounds.
- Teal only on "From seed to sprout."
- Up next slides sit on Coral. "Just covered: X" runs small and "Up next:"
  plus the next section's name runs large.
- Section names are the outline's headings as written: Intros, Brand
  Reciprocity, RFP, BRF Connection, Approach, BRF Identity, BRF Connection
  & Experience, Parallel Path. They may change once names are settled.
- Idea slides stay light, a mood image and a few words, so the presenter
  can spend one minute or five on them.
