# ◈ Viewscape One

A build-free, GitHub-Pages-ready **holographic data framework**. The home page is a field of tiles; each tile is a folder that holds its own page. Each page is a folder — hand-built, AI-built (any site, any framework), or JSON-driven — shown inside a hologram box, with a GTA-style radial wheel on the right edge.

## Run it

```bash
node tools/vs.mjs serve        # → http://localhost:8080
# or: python3 -m http.server
```
Opening `index.html` straight from disk won't work (browsers block `fetch` on `file://`). On GitHub Pages it just works — push the folder (the `.nojekyll` file is already there).

## Structure

```
viewscape-one/
├─ index.html                  home field (boot loader, tiles, hologram viewer)
├─ viewscape.config.json       names + styles the source folders (me, ai, …)
├─ HANDOVER.json               ← give this to AI
├─ assets/                     the framework library — don't edit per page
│  ├─ css/ theme · glass · holo · wheel · blocks · home
│  └─ js/  validate · core · fx · blocks · wheel · page · home
├─ pages/
│  ├─ me/   index.json + <slug>/…      your pages
│  └─ ai/  index.json + <slug>/…      AI's pages
├─ templates/  page/ (data) · custom/ (hand-built)
└─ (pages/sys/studio = in-browser control room)
└─ tools/vs.mjs   CLI
```

A page = `pages/<source>/<slug>/` containing `page.json` (+ `index.html`, + any media/data). The slug must be listed in `pages/<source>/index.json`.

## Add / remove pages

| Goal | How |
|---|---|
| AI builds a site | Paste `HANDOVER.json` into your AI (it follows `site_brief`) → it returns the files for `pages/ai/<slug>/` → save them there, add the slug to `pages/ai/index.json` (or `node tools/vs.mjs new ai <slug> --custom` first, then overwrite the files) |
| JSON data page (optional) | Studio → Import, or `node tools/vs.mjs import bundle.json` |
| New empty page | `node tools/vs.mjs new me my-page --title "My Page"` (add `--custom` for own HTML/CSS/JS) or **Studio → New page** |
| Hide a page | `node tools/vs.mjs hide me my-page` |
| Delete a page | `node tools/vs.mjs remove me my-page --yes` |
| New source folder | `node tools/vs.mjs source add friends --label Friends --icon user` |
| Check everything | `node tools/vs.mjs validate` |
| Without Node | copy `templates/page/` into `pages/<source>/<slug>/`, add the slug to `pages/<source>/index.json` (delete = reverse) |

## Pages

- **Data page** (default): `page.json` → `sections[] → blocks[]`. 30+ block types: text/paragraphs, video (mp4 or YouTube/Vimeo), image, gallery, audio, embed, links to pages/files, stats, charts (bar/line/area/donut/radar), sortable tables, timeline, tabs, accordion, columns, code, JSON viewer… See `HANDOVER.json` for every prop.
- **Custom page**: `"type":"custom"` — own `index.html/page.css/page.js`, still gets wheel + ambience, and can call `VS.blocks.render([...], el)`. A completely separate framework also works: put its build in the folder and set `"entry"` in `page.json`.
- Link between pages with `[[ai/sample-intel|label]]` in text or `"page":"ai/sample-intel"` in link items. Files are linked relative to the page folder.

## v1.1 — statusbar, touch, windows, fullscreen

- **Statusbar** replaces the navbar (title, clock, network, battery, linked windows, install, fullscreen). **All navigation is in the wheel** — Search (also `/`), Sources, Random, Studio, About, GitHub, Window, Display.
- **Touch:** swipe in from the right edge to open the wheel; the orb dims while you read; *Display ▸ Orb height* moves it into thumb reach; 44px targets; haptics; safe-area aware.
- **Fullscreen / app mode:** key `F` or the statusbar button. Install it (Chrome/Edge button, or iOS *Share ▸ Add to Home Screen*) and it launches true fullscreen via `manifest.webmanifest`; `sw.js` makes it work offline (network-first, so pushes show immediately).
- **Multi-window:** *Window ▸ Split view* (two pages side by side), *Pop out*, *Other screen* (multi-monitor, where supported), *Cast* to another Viewscape window; prefs/accent sync across windows.
- **Resource-friendly:** auto *lite mode* (low-core/low-memory, data saver, battery < 20%), animation pauses when hidden/idle/covered, capped particle fps. Override in *Display ▸ Performance*.
- **System pages** (`pages/sys/`): *About*, *GitHub* (renders the repo's README, files and commits inside the hologram — GitHub can't be framed — set `"github": "owner/repo"` in `viewscape.config.json`; auto-detected on GitHub Pages) and *Studio*.

## The wheel

Orb on the right edge of every page. **Hold → drag → release**, or tap then tap a wedge, or press **W** (arrows + Enter / 1-8 also work). Built-ins: Home · Sections · Prev/Next · Page extras · Colour · Share · Display. Add up to 8 of your own per page through `wheel.extras` in `page.json`. Wedges with a dot open sub-wheels.

## Extend

```js
VS.blocks.register('countdown', (block, ctx) => { const n = document.createElement('div'); n.textContent = block.to; return n; });
```
Add it from a page's own JS, or put it in `assets/js/` and load it in the templates for every page.

Accents: `magenta · red · violet · turquoise · sky · mint` (set per page with `"accent"`).
