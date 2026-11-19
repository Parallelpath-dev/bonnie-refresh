# Bonnie Plants RFP

Parallel Path's pitch to Bonnie Plants for the brand refresh, as three
HTML builds that read as one set, plus a hub page that links to them.

```
index.html  the hub, one screen linking to the three pieces
assets/     the hub's own stylesheet and fonts
pitch/      the presentation deck, 81 slides, plus a page of layouts
research/   the research and findings page, one long scroll
proposal/   the proposal deck, 15 slides, made to be read
```

Each folder has its own `CLAUDE.md`. Read that file before editing
anything in the folder. This file only covers how the three fit together.

## How they relate

`pitch/` is what gets presented in the room. `research/` and `proposal/`
are the two leave-behinds the deck points to.

The pitch deck links to both. On the slide headed "Everything from this
session on one page", the row "Research leave-behind" opens
`../research/index.html` and the row "SOW leave-behind" opens
`../proposal/index.html`. Those are the only links between the three.
Neither leave-behind links back. The hub links to all three.

The research page (seven sections) and the proposal are written and
built.

## The hub

`index.html` at the root is the page to send. It links to the three
pieces in this order: the presentation (`pitch/index.html`), research
and findings (`research/index.html`), the proposal
(`proposal/index.html`). It is one screen on the night ground, with the
same frame labels as the others ("Parallel Path + Bonnie Plants",
"Brand refresh", "November 2026") at the top and the foot.

The hub follows the same rule as the folders: its stylesheet
(`assets/css/hub.css`) and fonts (`assets/fonts/`) are its own copies.
Its tokens and type classes are a small subset of the research page's.
If a folder is renamed, update its `href` here too.

## Each folder stands alone

Every folder carries its own stylesheet, its own script where it has one,
its own copy of the fonts, and its own images. Nothing is shared at this
level and nothing loads from a CDN, a font service or another site. Every
path inside a folder is relative.

So a change to one folder never reaches another. A fix that belongs in all
three is made three times, once in each stylesheet:
`pitch/assets/css/bonnie.css`, `research/assets/css/research.css` and
`proposal/assets/css/proposal.css`.

The three are built differently, so markup does not move between them:

| Folder | Layout | Sizes | Script |
|---|---|---|---|
| `pitch/` | A fixed 1920 by 1080 canvas. Content is placed by its Figma position with `.at`. | `calc(N * var(--u))` | `deck.js` writes the frame and runs the slideshow |
| `research/` | A page that reflows. Bands, two halves, parts. | `rem` and `clamp()` | none |
| `proposal/` | 16:9 slides whose content reflows. A chapter index on the left. | `cqw` | its own `deck.js`, which builds the index and the frame |

The two `deck.js` files are different scripts with the same name.

## What the three share

These are kept the same by hand, so the set reads as one. When one
changes in a folder, change it in the other two.

- **Type.** IBM Plex Serif Light for display type and quotes, IBM Plex
  Sans for everything else. The class names are the same everywhere:
  `display-1` to `display-6`, `quote`, `lead`, `subhead`,
  `small-heading`, `body-large`, `body`, `body-small`, `label`. Each
  folder sizes them its own way.
- **Color tokens.** `--linen` #F6EDE6, `--night` #151515, `--slate`
  #233D4D, `--lime` #C6EB4C, `--coral` #E1885E, `--oat` #E6DACB. The decks
  also define `--teal` #3C6E71 and `--sand` #D0A684.
- **Grounds.** A slide or a band takes one ground class, `ground-linen`,
  `ground-slate`, `ground-night` and so on. The ground sets the
  background and the ink, and everything on it follows.
- **The frame text.** Three labels in the `label` style: "Parallel Path +
  Bonnie Plants", then the piece ("Brand refresh", "Research",
  "Proposal"), then "November 2026". In `pitch/` they come from `data-top`
  on `.deck`. In `research/` they are written in the hero and again in the
  footer. In `proposal/` they are in the footer. A change to the date or
  the client line is made in all three.
- **No pills anywhere.**
- Lime only on dark grounds. Color on whole elements, never on one word
  in a line. Italics only for quotes. No small numbers inside content.
  Teal only in the pitch deck, on "From seed to sprout".

## Previewing

Open any `index.html` in a browser, straight off disk. There is no build
step and no server to run. `pitch/layouts.html` opens the same way.

Both decks present one slide at a time on a large enough window and stack
as a plain scroll on a small one. Both print to PDF at one slide per
page, 16 by 9 inches, with background graphics turned on in the print
dialog.

## Hosting

Any static host works: GitHub Pages, Netlify, S3, a folder on a web
server. Upload the files as they are.

- **All three together.** Host this whole folder, with the hub at its
  root and keep `pitch/`,
  `research/` and `proposal/` as siblings under one parent, with these
  names. The pitch deck's two links then work as they are.
- **One folder alone.** Each folder runs alone. If `pitch/` is hosted
  without the other two beside it, its two links break. Point their
  `href` values at wherever the leave-behinds live, or host the three
  together.
- If a folder is renamed or moved, update the two `href` values on that
  slide in `pitch/index.html`.
- GitHub Pages runs Jekyll unless a file named `.nojekyll` sits at the
  root of the repo. Nothing here needs it today, since no folder name
  starts with an underscore. Add it if one ever does.
- All four pages, the hub included, are marked `noindex, nofollow`.
  Keep that.

Photos keep the filename Unsplash gives them. Do not rename them.
`.DS_Store` is ignored by `.gitignore` at this level.
