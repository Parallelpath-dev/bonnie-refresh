# Bonnie Plants research and findings page

Parallel Path's research leave-behind for the Bonnie Plants brand refresh,
built as one scrolling page. It is one of three pieces that read as a set:
the pitch deck in `../pitch/`, this page, and the proposal in
`../proposal/`. The look comes from the pitch deck: the same colors, the
same type classes, the same top line, rules and tiles. Michael Benjamin set
that art direction.

The page has eight sections (Jackson, Nov 18: Resonate and MediaRadar removed,
Tagged creator posts added; Site audit sits right after Search and AI audit). Every other
line of copy is a placeholder, and every sand block is labeled with what
goes in it.

## Files

```
index.html               the page, a hero and eight sections
assets/css/research.css  colors, type, the frame, every block, print
assets/fonts/            IBM Plex, with its Open Font License
assets/img/              photos, screenshots and charts go here
assets/video/            video files small enough to keep in git
```

Nothing here links to another Parallel Path page or stylesheet, and the
fonts are in the folder. Every path is relative, so the folder runs from
any host, or straight off disk, with no build step. The one script is `assets/js/clip-sync.js`
(see Clip with synced lines). Open
`index.html` in a browser to see it. Keep it that way: no CDN, no Google
Fonts, no absolute addresses.

The page is light only. There is no theme toggle and no motion.

## How the page is built

```html
<div class="band ground-night hero"> the top line, the title, the contents </div>
<main>
  <section class="band section ground-linen" id="interviews">
    <div class="wrap">
      <header class="section-head"> number, title, lede </header>
      <div class="part"> ... </div>
      <div class="part"> ... </div>
    </div>
  </section>
  ...
</main>
<div class="band ground-night"> the footer line </div>
```

- **Bands.** Every section is a `.band`, full width, on one ground.
  `.wrap` inside it holds the content to the page gutters.
- **Grounds.** A band takes one ground class: `ground-linen`,
  `ground-slate`, `ground-night` or `ground-coral`. The ground sets the
  background, the ink, the accent and the fill behind tiles and
  placeholders, so a block copied from a light section into a dark one
  recolors itself. Most sections sit on Linen. Overview and Reviews and
  social sit on Slate. The hero and footer sit on Night.
- **The two halves.** The page is two halves, the deck's left and right
  columns. Numbers, headlines and short intros sit in the left half.
  Content sits in the right half. Wide things run across both. Under 900
  wide the halves stack into one column.
- **The frame.** The top line in the hero and the footer line carry the
  same three labels. Change them in both places.

### A section

```html
<section class="band section ground-linen" id="site-audit">
  <div class="wrap">
    <header class="section-head">
      <p class="display-4 section-num">05</p>
      <div class="section-title">
        <h2 class="display-4">Site audit</h2>
        <p class="lead lede">Lede.</p>
      </div>
    </header>

    <div class="part"> ... </div>
  </div>
</section>
```

The number is the same size as the title beside it. The lede is one short
paragraph under the title.

### A part

A part is one group inside a section. It draws a full-width rule, then has
three slots. Use the ones the content needs.

```html
<div class="part">
  <div class="part-side">   left half: a headline, a short intro   </div>
  <div class="part-main">   right half: the content                </div>
  <div class="part-wide">   both halves: grids, wide tables, video </div>
</div>
```

- `part-side` takes an `h3` in `display-6`, with a `body` paragraph under
  it when the content needs explaining. A plain label takes
  `small-heading` in place of the headline.
- `part-main` and `part-wide` can both appear in one part. The wide slot
  lands under the other two.
- The space above the rule is set on `.part`. Do not add margins above a
  part to adjust it.

## Blocks

Each block goes inside `part-main` or `part-wide`. Where each one appears
in `index.html` is listed so there is a working copy to lift.

### Lede

One short paragraph under a section title. Every section has one.

```html
<p class="lead lede">Lede.</p>
```

### Stat row

A big number with its line beside it, one stat per row. The number takes
the accent on its own: Lime on Slate or Night, Slate on Linen. In
Overview, Mystery shopping and Tagged creator posts.

```html
<div class="stats">
  <div class="stat"><p class="display-3 stat-num">00</p><p class="body">Stat label</p></div>
  <div class="stat"><p class="display-3 stat-num">00</p><p class="body">Stat label</p></div>
</div>
```

### Big number

One number on its own, with a line and a source. In Reviews and social.

```html
<div class="big-stat">
  <p class="display-1 stat-num">00</p>
  <p class="body-large">Stat label</p>
  <p class="label muted" style="--tone: 45">Source: source name</p>
</div>
```

### Bars

A label, a bar and a value on each line. `--w` on the fill is the value
itself, so a 28% bar fills 28% of the track. Never scale the bars to the
largest one. The widths in the page now are stand-ins. In Search and AI
audit and Reviews and social.

```html
<div class="bars">
  <div class="bar">
    <span class="bar-label body-small">Bar label</span>
    <span class="bar-track"><span class="bar-fill" style="--w: 28%"></span></span>
    <span class="bar-value body-small">28%</span>
  </div>
</div>
```

### Data table

Column heads in the label style, soft rules between rows. `num` on a head
or a cell sets a figure flush right. The first cell of a body row is a
`th`. Keep the `table-wrap` so a wide table scrolls sideways on a phone
without stretching the page. A table with many columns goes in
`part-wide`. A small one fits in `part-main`. In Search and AI audit.

```html
<div class="table-wrap">
  <table class="data-table">
    <thead>
      <tr><th>Column</th><th class="num">Column</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">Row label</th><td class="num">00</td></tr>
    </tbody>
  </table>
</div>
```

### Quotes

A quote in serif italic with the speaker under it as a label. Quotes
stack with a fine rule between them. Add `is-large` to a `quote` for one
quote set very big across `part-wide`. Add `is-compact` to `quotes` for a
stack of several quotes; it sets them at about the part headline size. In Casual gardener interviews and
Reviews and social.

```html
<div class="quotes">
  <figure class="quote-item">
    <blockquote class="quote">“Quote goes here.”</blockquote>
    <figcaption class="label">Name, casual gardener</figcaption>
  </figure>
</div>
```

### Quote gallery

Short quotes as a grid of tiles, for when there are too many to stack.
Add `is-quotes` to `.tiles` in `part-wide`. Each tile is a `figure` with a
`quote` and a `label` saying where it was posted. Five across on wide
screens, two across under 1400, one column under 900. In Reviews and social.

```html
<div class="tiles is-quotes" style="--per-row: 5">
  <figure class="tile">
    <blockquote class="quote">“Quote.”</blockquote>
    <figcaption class="label muted">Where it was posted</figcaption>
  </figure>
</div>
```

### Placeholder

Where a photo, chart or screenshot goes once it exists. The label inside
says what belongs there. `--ratio` sets its shape and defaults to 16 by 9.
`is-coral` fills it Coral. To fill a placeholder, replace the whole block
with the image:

```html
<!-- Before -->
<div class="placeholder" style="--ratio: 4 / 3"><span class="small-heading">Chart: audience insights</span></div>

<!-- After -->
<img class="photo" src="assets/img/file.png" alt="What the chart shows" style="--ratio: 4 / 3">
```

`photo` crops the image to fill the ratio. For a chart that must show
whole, leave `photo` off and the image keeps its own shape.

### Photo grid

Even tiles. `--per-row` sets how many across and `--ratio` the shape of
each. Under 900 wide it drops to two across. A tile is a placeholder, a
photo, or a `figure` holding one of those with a `small-heading` caption.
In Casual gardener interviews (3 across) and Reviews and social (4 across,
with captions).

```html
<div class="photo-grid" style="--per-row: 3">
  <img class="photo" src="assets/img/file.jpg" alt="">
  <div class="placeholder"><span class="small-heading">Photo: interview capture</span></div>
</div>

<!-- With captions -->
<div class="photo-grid" style="--per-row: 4; --ratio: 438 / 560">
  <figure>
    <img class="photo" src="assets/img/file.jpg" alt="">
    <figcaption class="small-heading">Photo label</figcaption>
  </figure>
</div>
```

### Collage

Photos of mixed heights in columns, like the deck's collage of 15.
`--per-row` on the collage is the number of columns. Each photo takes its
own `--ratio`, width over height. Photos fill down the first column, then
the next. In Mystery shopping.

```html
<div class="collage" style="--per-row: 6">
  <img class="photo" src="assets/img/file.jpg" alt="" style="--ratio: 294 / 336">
  <div class="placeholder" style="--ratio: 294 / 280"><span class="small-heading">Photo: store visit</span></div>
</div>
```

### Video box

A 16 by 9 box. Empty, it shows a play mark and a label naming the clip.
Replace the `media-empty` span with the video and it fills the box.
`.clip` sets the box beside what the person says, and goes in
`part-wide`. In Casual gardener interviews.

```html
<div class="clip">
  <figure class="media">
    <span class="media-empty"><span class="small-heading">Video: interview clip</span></span>
  </figure>
  <div class="clip-text">
    <p class="body-large">What the person says in the clip.</p>
    <p class="small-heading muted">Name, casual gardener</p>
  </div>
</div>

<!-- A file -->
<figure class="media"><video src="assets/video/clip.mp4" controls playsinline preload="metadata"></video></figure>

<!-- An embed -->
<figure class="media"><iframe src="https://player.vimeo.com/video/ID" allow="fullscreen; picture-in-picture" allowfullscreen></iframe></figure>
```

GitHub refuses any file over 100 MB, so host long clips on Vimeo or
similar and embed them. An embed is the one thing on the page that needs
a connection. A `.media` box on its own, without `.clip`, runs the full
width of its slot.

### Clip with synced lines

The one exception to "no script" (Jackson, Nov 17), so interview clips
work as they do in the deck. Put `data-clip` on the `.media` figure and a
`.clip-lines` group with the same `data-clip` in `clip-text`. Each
`.clip-line` carries `data-from`, the second where it takes over.
`assets/js/clip-sync.js` swaps the lines as the video plays. Without the
script the first line (`is-on`) shows. In print every line shows.

```html
<figure class="media" data-clip="name"><video src="..." controls playsinline preload="metadata"></video></figure>
<div class="clip-text">
  <div class="clip-lines" data-clip="name">
    <p class="body-large clip-line is-on" data-from="0">“First line.”</p>
    <p class="body-large clip-line" data-from="4">“Next line.”</p>
  </div>
  <p class="small-heading muted">Name, casual gardener</p>
</div>
```

### Screenshot block

A screenshot with a caption under it. `--ratio` on the `figure` sets the
shape and defaults to 16 by 10. A real screenshot is cropped from the top
and gets a fine edge, so a white page does not bleed into the ground.
`.shots` sets two side by side, one in each half, and goes in `part-wide`.
In Search and AI audit and Site audit.

```html
<figure class="shot">
  <img src="assets/img/homepage.png" alt="The Bonnie Plants homepage">
  <figcaption class="body-small">Caption.</figcaption>
</figure>

<div class="shots">
  <figure class="shot"> ... </figure>
  <figure class="shot"> ... </figure>
</div>
```

### Rows

A list of rows with a fine rule between them. A row is a serif title and
a line, or one line on its own. The first row sits under the part's rule.
Rows carry no numbers. In Casual gardener interviews, Mystery shopping,
Site audit and More ideas.

```html
<div class="rows">
  <div class="row"><h4 class="display-5">Row title</h4><p class="body-small">A line of supporting copy.</p></div>
  <div class="row"><p class="subhead">Row item</p></div>
</div>
```

### Panel

A flat panel for a document or an excerpt: a label, then the text. It
always runs the full width of its slot. In Search and AI audit.

```html
<div class="panel">
  <p class="small-heading">Panel title</p>
  <p class="body-small">Body copy.</p>
</div>
```

### Tiles

Flat panels in a row, a serif title at the top and a line at the foot,
like the deck's three tiles. `--per-row` sets how many across. Under 900
wide they stack. In More ideas.

```html
<div class="tiles" style="--per-row: 3">
  <div class="tile"><h4 class="display-6">Tile title</h4><p class="body-small">A line of supporting copy.</p></div>
</div>
```

## Type

Class names match the pitch deck and the text styles in its Figma file.
The deck is a fixed canvas. This page scales, so each size is a range that
reaches the deck's size on a 1920 screen.

| Class | Font | Range | Used for |
|---|---|---|---|
| `display-1` | Plex Serif Light | 72 to 216 | Big number |
| `display-2` | Plex Serif Light | 44 to 168 | Hero title |
| `display-3` | Plex Serif Light | 48 to 136 | Stat numbers |
| `display-4` | Plex Serif Light | 36 to 104 | Section number and title |
| `display-5` | Plex Serif Light | 28 to 68 | Row titles |
| `display-6` | Plex Serif Light | 22 to 42 | Part headlines, tile titles |
| `quote` | Plex Serif Light Italic | 28 to 68 | Quotes. `is-large` runs 40 to 136 |
| `lead` | Plex Sans Medium | 22 to 40 | Lede |
| `subhead` | Plex Sans Medium | 18 to 30 | Contents, one-line rows |
| `small-heading` | Plex Sans Medium | 15 to 20 | Labels, captions, placeholder labels |
| `body-large` | Plex Sans | 20 to 36 | Clip text, the line under a big number |
| `body` | Plex Sans | 17 to 26 | Body copy, stat labels |
| `body-small` | Plex Sans | 16 to 24 | Row lines, captions, bars, table cells |
| `label` | Plex Sans SemiBold, uppercase | 12 | The frame, quote names, table heads, sources |

`muted` sets a line in the ink at 60 percent. For another strength, set
`--tone`, as in `<p class="muted" style="--tone: 45">`.

Write sizes in `rem` and `clamp()`. The deck's `--u` unit and `.at`
placement do not exist here.

## Colors

| Token | Hex | Use |
|---|---|---|
| `--linen` | #F6EDE6 | Light ground, ink on dark grounds |
| `--slate` | #233D4D | Ink on light grounds, dark ground |
| `--night` | #151515 | Dark ground, hero and footer |
| `--lime` | #C6EB4C | Accent on dark grounds only |
| `--coral` | #E1885E | One block, the homepage screenshot placeholder |
| `--oat` | #E6DACB | Placeholders, tiles, panels, bar tracks on Linen |

Inside a band, blocks read four values the ground sets. Use these in any
new rule so it works on every ground.

| Value | On Linen | On Slate or Night |
|---|---|---|
| `--bg` | Linen | Slate or Night |
| `--ink` | Slate | Linen |
| `--mark` | Slate | Lime |
| `--tile` | Oat | Linen at 12 percent |

## Adding, removing and moving sections

To add a section, copy a whole `<section class="band section ...">` block
and then:

1. Give it a new `id`.
2. Set its number and title in `section-head`.
3. Add a row for it to the contents in the hero, `<nav class="toc">`,
   with the `href` pointing at the new `id`.
4. Renumber every section after it, in both the section heads and the
   contents. The numbers are written by hand in both places.

To remove a section, delete its `<section>` and its row in the contents,
then renumber. To move one, move the `<section>` and its contents row
together, then renumber.

To change a section's ground, swap its ground class. Nothing else needs to
change.

To add a part, copy a `.part` from any section. Parts work the same in
every section and on every ground.

## Photos

Photos, screenshots and charts go in `assets/img/`. Size a photo to about
2400 on the long edge before adding it, the same as the deck. Give every
image an `alt` that says what it shows. A decorative photo takes
`alt=""`.

## Print

Print to PDF from the browser. Every ground flattens to white with black
ink, tiles and placeholders become outlines, the two halves stack, and no
row, stat, quote, photo or table row is cut across a page. The rules for
this are at the foot of `research.css`. A new block that should not split
across pages needs adding to the `break-inside: avoid` list there.

## Settled decisions

These follow the pitch deck and were set with Michael. Keep them unless
the team changes them.

- No pills anywhere, no theme toggle, no logo link, no scroll cue under
  the hero.
- Section numbers sit at the size of the title beside them. No small
  numbers inside content and no numbered rows.
- Two columns is the most for text inside a section. Photo and tile grids
  can run wider.
- Panels never sit side by side.
- A rule that separates groups runs the full width of the column.
- Color goes on whole elements, never on one word in a line.
- Italics only for quotes.
- Lime only on dark grounds. Coral sparingly. Teal not at all.
- No address or file path printed on the page. A link reads as a label.
- The page stays `noindex, nofollow`.
