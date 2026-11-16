# Bonnie Plants proposal deck

Parallel Path's proposal for the Bonnie Plants brand refresh, built as an
HTML deck made to be read ahead of a meeting. It is one of three pieces
that sit side by side: `pitch/` is the presentation, `research/` is the
background page, and this folder is the proposal with scope and pricing.

The look is the pitch deck's: the same type classes, colors and grounds.
The structure is different. The pitch deck is a fixed 1920 by 1080 canvas
with a few words per slide. This deck carries paragraphs, lists and
tables, so its slides reflow and its chapters have an index.

Every slide ships with placeholder copy: "Headline", "Body copy.", "Fee",
"TBD", "Name", "Role". Chapter names and slide headlines are real.

## Files

```
index.html               the deck, 14 slides in seven chapters
assets/css/proposal.css  colors, type, the slide, the blocks, live, print
assets/js/deck.js        builds the index and the frame, runs the deck
assets/fonts/            IBM Plex, with its Open Font License
assets/img/              the Parallel Path wordmark, and photos once added
```

Nothing here links to another page, stylesheet or font service. Every
path is relative, so the folder runs from any host or straight off disk,
with no build step. Open `index.html` in a browser to see it.

## Reading and presenting

On a screen at least 1000 by 600 the deck goes live and shows one slide
at a time, with the index on the left and the footer pinned to the foot
of the window.

- Next: right or down arrow, Page Down, space, a scroll, or the solid
  arrow at the top right of the slide
- Back: left or up arrow, Page Up, or the outlined arrow
- Home and End jump to the first and last slide
- A chapter in the index jumps to its first slide. The arrows at the foot
  of the index move one chapter. The deck title at the top of the index
  goes back to the cover.
- The address takes a chapter, `index.html#pricing`, so a link can open
  on any chapter.

One scroll gesture moves one slide, however long the gesture. The slides
still to come in a chapter show as edges behind the current one, and the
pips under the current chapter in the index show where you are in it.

On a smaller screen the slides stack as a plain scroll. Down to 821 wide
they keep 16:9 and grow if the content needs it. At 820 and under they
drop 16:9, two columns become one, and the team grid goes two across.

## Printing

Print to PDF gives one slide per page at 16 by 9 inches, every slide
fully shown. Turn on background graphics in the print dialog. On paper
each page gets a line at its foot that repeats the footer's labels and
adds the page number. The cover gets the labels without a number, and the
closing slide gets no line because the wordmark fills its foot.

## How the deck is built

```html
<main class="deck" data-deck data-title="Bonnie Plants|Brand Refresh">
  <div class="deck-stage">
    <nav class="deck-index" aria-label="Chapters"></nav>
    <div class="deck-frame">
      <section class="chapter" id="phases" data-name="Phases">
        <article class="slide ground-linen"> ... </article>
      </section>
      ...
    </div>
  </div>
  <div class="deck-track"></div>
</main>

<footer class="deck-foot label">
  <span>Parallel Path + Bonnie Plants</span>
  <span>Proposal</span>
  <span>November 2026</span>
  <span class="deck-page" aria-hidden="true"></span>
</footer>
```

- **Chapters.** Each `.chapter` is one chapter. Its `data-name` is the
  name in the index and in the label at the top of its slides. Its `id`
  is the address, `#phases`. A chapter with no `id` takes one from its
  name. Chapter numbers come from the order in the file, so nothing is
  numbered by hand.
- **Slides.** Each `.slide` is one slide and takes one ground class.
- **The index** is written by `deck.js` into the empty `.deck-index`. Its
  title comes from `data-title` on `.deck`: the client, then the project,
  split by a `|`.
- **The frame** is written by `deck.js` on every slide: the chapter label
  at the top left ("02  Phases"), the arrows at the top right, and the
  print line at the foot. Never write these into a slide by hand.
- **The footer** holds the frame text. Change the three labels there and
  the print line on every page follows. Leave `.deck-page` empty. The
  script fills it with the page number while the deck is live.
- **The cover** takes `data-kind="cover"`. It gets no chapter label and
  no page number. A slide with `data-frame="none"` gets the arrows only.
- `.deck-index` and `.deck-track` stay empty in the markup.

## Adding, removing and reordering

- **Add a slide.** Copy an `<article class="slide ...">` from the same
  chapter, or the example for its type below, and paste it where it
  belongs inside a `.chapter`. The pips, the page numbers and the count
  in the footer update themselves.
- **Remove a slide.** Delete its `<article>`.
- **Reorder slides.** Move the `<article>`. Order in the file is order in
  the deck.
- **Add a chapter.** Add a `<section class="chapter" data-name="...">`
  with at least one slide inside `.deck-frame`. It appears in the index
  with the next number.
- **Remove or reorder a chapter.** Delete or move its `<section>`. The
  numbers follow.
- **Rename a chapter.** Change `data-name`. Keep the `id` if anything
  links to it.
- **When a slide runs out of room.** A live or printed slide is a fixed
  16:9 and clips what does not fit. Check a full slide in the live view
  and in the print preview. When the content is too long, split it over
  two slides before making the type smaller.

A slide copied from the pitch deck will not work here. Its content is
placed with `.at` and `--u`, which this deck does not have. Rebuild it
from the slide types below.

## Sizes

Content reflows. Nothing is placed by coordinates.

Sizes inside a slide are written in `cqw`, a hundredth of the slide's
width, so a slide scales as one piece when live and on paper. A value in
`cqw` is the pitch deck's pixel value over 19.2: its 26 is `1.354cqw`.
In the stacked scroll each size also holds a minimum in pixels, set
beside it in `proposal.css`, so type stays readable on a phone.

Use the type classes and the blocks below before writing a size by hand.
When a new rule is needed, write it in `proposal.css` in the same form:
`max(1.25cqw, calc(15px * var(--floor)))`. `--floor` is 1 in the stacked
scroll and 0 live and in print.

## Slide types

Every slide is a headline and one block. Seven types are in the deck.

### Cover

The title at the foot of a Night slide, one line per part.

```html
<article class="slide slide-cover ground-night" data-kind="cover">
  <h1 class="display-2">
    <span>Bonnie Plants</span>
    <span class="muted">Brand Refresh</span>
    <span class="muted">Proposal</span>
  </h1>
</article>
```

For a photo behind the title, put
`<img class="slide-media" src="assets/img/file.jpg" alt="">` ahead of the
`<h1>`. It fills the slide at half strength.

### Statement

Two columns. The headline and a lead on the left, running text on the
right. Used for What Bonnie asked for and What Parallel Path proposes.

```html
<article class="slide ground-linen">
  <div class="cols">
    <div>
      <h2 class="display-4">Headline</h2>
      <p class="lead">Body copy.</p>
    </div>
    <div>
      <p class="body-large">Body copy.</p>
      <p class="body">Body copy.</p>
      <div class="tile push">
        <h3 class="display-6">Headline</h3>
        <p class="body-small">Body copy.</p>
      </div>
    </div>
  </div>
</article>
```

The tile is optional. `push` sends it to the foot of the column.

### Rows beside a headline

Two columns. The headline and a lead on the left, ruled rows on the
right. Each row is a serif title with a line or a list beneath. Used for
the three phases, the three tiers and Next steps.

```html
<article class="slide ground-linen">
  <div class="cols">
    <div>
      <h2 class="display-4">Must have</h2>
      <p class="lead">Body copy.</p>
    </div>
    <div class="rows">
      <div class="row">
        <h3 class="display-6">Brand strategy</h3>
        <p class="body-small">Body copy.</p>
      </div>
      <div class="row">
        <h3 class="display-6">What happens</h3>
        <ul class="lines body-small">
          <li>Activity</li>
          <li>Activity</li>
        </ul>
      </div>
    </div>
  </div>
</article>
```

Five rows of a title and one line fit. So do three rows where two carry
a list of three.

### Table

The headline on top and a table across the full width, pushed to the
foot. Used for Pricing, on Slate, with the fees in Lime.

```html
<article class="slide ground-slate">
  <h2 class="display-4">Pricing</h2>
  <div class="push">
    <table class="table">
      <thead>
        <tr>
          <th class="label" scope="col">Tier</th>
          <th class="label num" scope="col">Fee</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <h3 class="display-5">Must have</h3>
            <p class="body-small muted" style="--tone: 80">Body copy.</p>
          </td>
          <td class="num"><p class="display-5 in-lime">Fee</p></td>
        </tr>
      </tbody>
    </table>
    <p class="body-small muted">Body copy.</p>
  </div>
</article>
```

`num` sets a cell flush right and keeps it on one line. On a light
ground, drop `in-lime` from the fee.

### People

The headline on top and one column per person, pushed to the foot. Used
for Team.

```html
<article class="slide ground-linen">
  <h2 class="display-4">Your team at Parallel Path</h2>
  <div class="people push">
    <div class="person">
      <div class="placeholder"><span class="small-heading">Photo</span></div>
      <p class="subhead">Name</p>
      <p class="label">Role</p>
    </div>
  </div>
</article>
```

Three to six people fit one row. The photo blocks give up height before
the slide overflows. To fill one, replace the placeholder with the photo:

```html
<img class="photo" src="assets/img/file.jpg" alt="Name">
```

### Dated rows

The headline on top and full-width rows pushed to the foot, each with a
date or a short label on the left. Used for Timeline.

```html
<article class="slide ground-linen">
  <h2 class="display-4">Timeline</h2>
  <div class="rows push">
    <div class="row pair">
      <p class="subhead">TBD</p>
      <div>
        <h3 class="display-6">Kickoff</h3>
        <p class="body-small">Body copy.</p>
      </div>
    </div>
  </div>
</article>
```

Five rows fit under a one-line headline.

### Closing

A headline and a line on Slate, with the Parallel Path wordmark running
the full width of the foot and off its edges, as on the pitch deck's
opening slide.

```html
<article class="slide slide-close ground-slate">
  <h2 class="display-3">Headline</h2>
  <p class="lead muted" style="--tone: 80">Body copy.</p>
  <img class="wordmark" src="assets/img/parallel-path-wordmark.svg" alt="Parallel Path">
</article>
```

The wordmark file is Linen, so the closing slide stays on a dark ground.

## Layout helpers

| Class | What it does |
|---|---|
| `cols` | Two equal columns. Each direct child is a column. One column at phone width. |
| `push` | Sends a block to the foot of the slide or of its column. |
| `rows`, `row` | Ruled rows. Each row opens with a thin rule the full width of its column. |
| `row pair` | A row with a date or a short label in a left column. |
| `lines` | A list with one item per line and a soft rule between. |
| `table`, `num` | A table with label headings and ruled rows. `num` sets a cell flush right. |
| `tile` | A flat sand panel behind a title and a line, the full width of its column. `is-tint` on dark grounds. |
| `placeholder` | Where a photo, an image or a chart goes once it exists. The label inside says what belongs there. `is-tint` on dark grounds. |
| `photo` | A photo. It fills its box and crops to fit. |
| `people`, `person` | The team grid. |
| `slide-media` | A photo that fills the cover behind the title. |
| `wordmark` | The Parallel Path wordmark across the foot of the closing slide. |

## Type

The class names are the pitch deck's, which match the text styles in its
Figma file. Sizes are in pitch deck pixels, on a 1920 slide.

| Class | Font | Size |
|---|---|---|
| `display-1` to `display-6` | Plex Serif Light | 216, 168, 136, 104, 68, 42 |
| `quote` | Plex Serif Light Italic | 104 |
| `lead` | Plex Sans Medium | 40 |
| `subhead` | Plex Sans Medium | 30 |
| `small-heading` | Plex Sans Medium | 20 |
| `body-large` | Plex Sans | 36 |
| `body` | Plex Sans | 26 |
| `body-small` | Plex Sans | 24 |
| `label` | Plex Sans SemiBold, uppercase | 12, never under 10 on screen |

Where each is used in this deck:

- `display-2` is the cover title. `display-3` is the closing headline.
- `display-4` is the headline of every other slide.
- `display-5` is a tier name and a fee in the pricing table.
- `display-6` is a row title and a tile title.
- `lead` is the line under a headline.
- `body-large` and `body` are running text. `body-small` is the line or
  the list under a row title.
- `subhead` is a name in the team grid and a date in a dated row.
- `small-heading` is the label inside a placeholder.
- `label` is a role, a table heading, and all the frame text.

`muted` sets a line in the ink at 60 percent. For another strength, set
`--tone`, as in `<p class="muted" style="--tone: 80">`.

`in-lime`, `in-linen`, `in-night` and `in-slate` set a whole element in
that color.

## Colors

| Token | Hex | Brand kit name | Use |
|---|---|---|---|
| `--linen` | #F6EDE6 | Linen | Light ground, ink on dark grounds |
| `--night` | #151515 | Night | The page around the slides, the cover |
| `--slate` | #233D4D | Cadet | Ink on light grounds, the pricing and closing slides |
| `--lime` | #C6EB4C | Spring | Accent on dark grounds: fees, the current chapter in the index |
| `--oat` | #E6DACB | not in the kit | Tiles and placeholder blocks |
| `--coral` | #E1885E | Coral | Not used yet |
| `--sand` | #D0A684 | Sand | Not used yet |
| `--teal` | #3C6E71 | Current | Not used on this deck |

### Grounds

Every slide takes one ground class. The ground sets the background and
the ink, and everything on the slide follows: rules, arrows, the chapter
label.

| Class | Background | Ink |
|---|---|---|
| `ground-linen` | Linen | Slate |
| `ground-night` | Night | Linen |
| `ground-slate` | Slate | Linen |
| `ground-lime` | Lime | Slate |
| `ground-coral` | Coral | Slate |
| `ground-teal` | Teal | Linen |

`ground-teal` exists so every ground class from the pitch deck resolves
here. Teal is not used on this deck.

## Design decisions to keep

These carry over from the pitch deck so the three pieces read as one set.

- No pills anywhere.
- No small numbers inside slide content and no numbered rows. Chapter
  numbers in the index and the frame, and the page number, are part of
  the frame and stay.
- Text runs in two columns at most on a slide.
- Tiles, panels and cards stack. They never sit side by side.
- A rule that separates rows runs the full width of its column.
- Color goes on whole elements, never on one word in a line.
- Italics only for quotes.
- Lime only on dark grounds.
- No teal.
- No header, no scroll cue, and no address or file path printed on a
  slide.
- No motion beyond the move from one slide to the next. With the system
  set to reduce motion, slides change at once.
- The page stays `noindex, nofollow`.
