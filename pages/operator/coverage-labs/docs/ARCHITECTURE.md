# Architecture — Coverage Labs V0.1.4.1

- `app/` is the only directory served by `server.mjs`.
- `app/index.html` is the learner home.
- `app/tutorial.html` contains the seven-module Solstice guided tutorial.
- `app/worked-example.html` contains the Frequency worked investigation, evidence trail, report and local review notes.
- `app/exam.html` contains the Palisade independent exam brief, source shelf, investigation work areas and local notes workspace. It provides no suggested findings or learner-facing answer key.
- `app/research-lab/palisade/` contains the fictional Palisade website, wiki, research desk, registers and eleven multi-page source PDFs.
- `app/research-lab/institutions/atlas-registry/` and `regional-access-office/` contain fictional institutional context pages and link to relevant Palisade source records.
- `app/research-lab/frequency/` contains the Frequency company world, Signal Desk institution, registers and nine multi-page PDFs.
- Existing Noordlicht, Rivierzorg and Kompas worlds remain in their original locations.
- `facilitator-only/` contains teaching keys and is outside the served application. Palisade's facilitator key and assessment guide are stored there.
- `picker-foundation-preserved/` is an archival preservation copy, not a Coverage Labs runtime dependency.

Palisade exam notes, completion markers and review-state use browser `localStorage`. Export creates a local JSON copy. Data remains in the current browser profile unless exported; no account, cloud sync or automatic backup is provided.


## V0.1.4.1 — External Information Ecosystem

- `app/search/` contains VINDR, a local search UI and generated `search-index.json`. `scripts/build-search-index.mjs` indexes local HTML, Markdown, CSV, text and PDF files under `app/`; PDF text extraction uses `pdftotext`. No external search service or public internet connection is used.
- `app/wiki/` contains KennisKade, a fictional encyclopedia with source-cited articles, a source catalogue and per-article local editing. Article edits are stored in browser `localStorage`; source IDs are validated against `sources.json`. Per-article JSON export is available. No server-side publishing, multi-user editing or synchronisation is provided.
- `app/research-lab/institutions/` contains distinct fictional institutional portals and archive pages. Additional multi-page records expand Noorder Cooperative Bank, KRO, DBR, NZT, De Zorglijn, Civic Lens, Atlas Registry and Waypoint Audit Office.
- Search advertisements are fictional and labelled as simulation. Search-engine glitches are presentation effects; they do not corrupt the underlying index.
- All external institutions, records, companies and publications are fictional training material.


## V0.1.4.2 — Operator Academy

`app/workspace/` contains the eight-module course, shared cross-company notebook and six reusable profile forms. Course state and profile fields use browser localStorage, with JSON export/import. `app/sw.js` and `app/precache-manifest.json` cache the learner application and local source corpus for offline use. The service worker scope is the learner app origin root; facilitator-only content remains outside `app/` and is not cached.


## V0.1.4.4 learner structure

- Landing page is a choice-based public entry point: Tutorial, Academy, Exam and browse the fictional web.
- Academy (`app/workspace/`) is the central workbench. Its ten modules cover entity resolution, claims, source provenance, evidence/confidence, motives, supplier/platform analysis, triangulation, practical access, metrics and competing explanations.
- Tutorial contains nine interactive modules; Exam remains an independent seven-area investigation with additional ownership, incentive and falsifier prompts.
- Former Casebook pages are outside the learner app in `facilitator-only/legacy-casebook-archive/`; the hypothesis-ledger philosophy is integrated into Academy.
- VINDR indexes 247 local documents. GoedGeregeld's 43 individual archive documents are excluded from ordinary indexing and reached through advertisements.
- Seven additional institutions each have a site, wiki and indexed source documents: Wetering Civic Capital, Noordzee Energy & Terminals, Atlas Civic Growth Fund, DeltaGrid Services, Van Wetering Family Office, North Quay Terminal and Meridian North Sea Energy.
- Kompas is the independent member-owned insurer; it does not deploy GoedGeregeld and receives no GoedGeregeld ads.
