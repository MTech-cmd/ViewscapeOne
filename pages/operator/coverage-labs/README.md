# Coverage Labs

**Current implementation candidate:** V0.1.4.4 — Open World & Academy Refresh (awaiting review)  
**Project type:** Public, local-first fictional investigative journalism playground

Coverage Labs teaches investigative research through fictional insurance groups, institutions, source documents and cases. All fictional entities, people, policies, claims, metrics and publications are simulation material and must not be represented as real-world evidence.

## Start

```bash
npm run serve
```

Open `http://localhost:8000`. The learner home is `app/index.html`. VINDR Search is at `/search/`; KennisKade is at `/wiki/`; the institution directory is `/research-lab/institutions/`.

## Learning experiences

- V0.1.1 — Independent Foundation
- V0.1.2 — Guided Tutorial (Solstice; Operator approved)
- V0.1.3 — Worked Example (Frequency; Operator approved)
- V0.1.4 — Independent Exam Experience (Palisade; available for Operator playthrough)
- V0.1.4.1 — External Information Ecosystem (KennisKade, VINDR and expanded fictional institutions)
- V0.1.4.2 — Investigator Academy, six profiles, unresolved shared case and offline progress
- V0.1.4.3 — Public Playground, deployment-prefix-safe navigation, company logos and GoedGeregeld site
- V0.1.4.4 — Open World & Academy Refresh: ten Academy modules, nine tutorial modules, hypothesis ledger, expanded institution network, sponsored vendor placements and public entry choices
- V0.1.5 — Learner Playthrough (planned; not started)

## Validation

```bash
npm run build:search
npm test
npm run check:links
```

Only `app/` is served by the local learner server. `facilitator-only/` and `picker-foundation-preserved/` remain outside learner access. No Picker research or development may begin until the Operator completes the Coverage Labs playthrough and explicitly authorises it.

## Independent exam

Open `app/exam.html` from the learner home to investigate the fictional Palisade case PA-014. The exam contains no learner-facing answers or guided hints. Notes are stored locally and can be exported as JSON.

## External information ecosystem

- **VINDR** indexes local HTML, Markdown, CSV and PDF material under `app/`. It does not search the public internet. Rebuild with `npm run build:search`. Full-text indexing of PDF documents uses the `pdftotext` utility (provided by Poppler); without it, PDFs remain indexed by filename only. Search results may include clearly labelled fictional advertisements and simulated index glitches.
- **KennisKade** is a source-cited, editable fictional knowledge base. Article edits are stored in the current browser profile, require source IDs from the local catalogue, and can be exported per article. It is not a multi-user publishing system.
- Institutional portals have distinct visual identities and expanded PDF archives. All records are fictional and have no real-world legal, financial or regulatory effect.


### V0.1.4.1.1 — Palisade visual refresh

Palisade now uses a witchy pastel sage-green and purple-goth Halloween palette across its public website, wiki, research desk, exam workspace and learner-home card. Other company worlds and all source-record content remain unchanged.


## V0.1.4.2 — Investigator Academy and profiles

Open `/workspace/` for a ten-module research-method course, a shared cross-company notebook and reusable profile forms for Noordlicht, Rivierzorg, Kompas, Solstice, Frequency and Palisade. Frequency is prefilled as the worked example; Solstice is the guided tutorial; the other four profiles are learner-completed. Profile and course progress is stored in browser localStorage and can be exported/imported as JSON. No account or server-side sync is provided.

The learner app includes an offline service worker and precache manifest. Open the app online once and allow the service worker to finish caching before going offline. Offline availability depends on browser support and storage not being cleared. Facilitator-only materials remain outside `app/` and are not included in the cache manifest.


## V0.1.4.3 — Public Playground

Coverage Labs is presented as an open fictional investigative-journalism playground, not a personal workspace. Every visitor can use the same course and fictional cases; progress and notes remain in that visitor's browser and are not shared or uploaded.

All app URLs are deployment-prefix aware. The app works at the domain root and beneath a mount such as `/pages/ai/coverage-labs/app/`. The service worker, precache manifest and PWA start URL resolve relative to the installed app scope.

All six insurer worlds now display their own logo. GoedGeregeld is a workflow-software provider with a website, wiki, 2004–2027 history and a 43-record archive. Its pages are discovered through sponsored placements; its own documents are excluded from ordinary VINDR indexing. Five insurer deployments are documented; Kompas records a declined proposal and maintains an independent stack.


## Public learner experience (V0.1.4.4 candidate)

Coverage Labs is presented as an open fictional investigative-journalism playground. The landing page offers direct choice: Tutorial, Academy, Exam or browse the fictional web. The Academy is the central workbench. Learner-facing copy does not prescribe a personal journey or expose facilitator-only guidance. All people, entities, records, motives and events are fictional simulation material.


## V0.1.4.4 — Open World & Academy Refresh

Public entry is now choice-based: Tutorial, Academy, Exam or browse the fictional web. The Academy is the central workbench with ten updated modules, an evidence-and-motives method and a competing-explanations ledger. GoedGeregeld is discovered through VINDR advertising and site placements; its own records are available within its site but excluded from ordinary VINDR indexing. Kompas is the independent member-owned counterexample and does not deploy GoedGeregeld. The institutional ecosystem now includes energy, infrastructure, investment, family-office and capital entities with their own sites, wikis and source records. The Casebook is no longer a learner-facing destination; its competing-explanations method is integrated into the Academy. The former pages are retained only in the facilitator archive.


## V0.1.4.5 — Interface and research directory refresh
- Landing page uses a clearer blue/turquoise/violet palette, readable typography and four learning-mode panels followed by six company panels plus VINDR.
- Academy uses violet as its primary accent and contains a native editable casebook workspace.
- VINDR search UI refreshed as a modern local-web search engine.
- Sources directory includes all 16 institutional sites, all six insurer worlds, VINDR and GoedGeregeld.
- Palisade public site navigation does not expose a sources-directory link.
