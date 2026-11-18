# Source and Preservation Map — V0.1.1 Independent Foundation

## Input

The working source was the expanded archive `dutch-health-insurance-picker-2027-coverage-lab-expanded.zip`, extracted from the current conversation's `/mnt/data` workspace. The archive itself remains untouched there and is recoverable.

## Placement

| Source location | New location | Handling |
|---|---|---|
| Root `index.html` | `docs/reference/combined-project-portal.html` | Preserved as a reference; new learner home is `app/index.html` |
| `research-lab/` | `app/research-lab/` | Copied intact; relative links remain within the research world |
| `styles.css` | `docs/reference/combined-project-styles.css` | Preserved as a reference to the old combined portal |
| `FACILITATOR_ONLY/` | `facilitator-only/` | Moved outside the served app directory |
| `foundation/` | `picker-foundation-preserved/foundation/` | Copied intact |
| Root `data/`, `schemas/`, `modules/`, `tests/` | `picker-foundation-preserved/root-baseline/` | Copied intact because the source had overlapping root/foundation versions |
| Root Picker docs and package manifest | `picker-foundation-preserved/root-baseline/` | Preserved as provenance/reference material |

## Exclusions and boundaries

- No fictional company, policy, claim or source record was migrated into Picker datasets.
- No Picker schema or validation logic was modified.
- No original source archive files were deleted.
- No `.git/` directory was present in the expanded archive's extracted project tree; no Git history was copied into the independent project.
- The Coverage Labs server does not serve `facilitator-only/` or `picker-foundation-preserved/`.

## Authoritative Coverage Labs application

`app/index.html` is the learner entry point. `app/research-lab/` is the authoritative location for the existing fictional research worlds. `app/index.original.html` is a historical copy only.

## V0.1.4 additions

| New source location | Purpose | Handling |
|---|---|---|
| `app/research-lab/palisade/` | New fictional Palisade exam company, public website, wiki, research desk, claims/source registers and eleven three-page PDFs | Added as a separate learner-facing simulation world; no existing company files overwritten |
| `app/research-lab/institutions/atlas-registry/` | Fictional registry portal for Palisade entity extract PAL-SRC-002 | Added as a separate institutional page |
| `app/research-lab/institutions/regional-access-office/` | Fictional oversight portal for PAL-SRC-009 | Added as a separate institutional page |
| `app/exam.html` | Independent Palisade case PA-014 and local investigation workspace | Added as the V0.1.4 learner entry point |
| `facilitator-only/PALISADE_EXAM_GUIDE.md` | Expected findings, assessment rubric and debrief | Kept outside the served `app/` directory |

The V0.1.4 additions do not alter the preserved Picker foundation or the Noordlicht, Rivierzorg and Kompas company directories.


## V0.1.4.1 additions

| New or expanded location | Purpose | Handling |
|---|---|---|
| `app/search/` | VINDR local search UI, script and generated corpus index | Indexes all local HTML, Markdown, CSV, text and PDF material under `app/`; no public internet search |
| `app/wiki/` | KennisKade source-cited fictional encyclopedia, source catalogue and editable articles | Browser-local edits with known-source-ID validation and per-article JSON export |
| `app/research-lab/institutions/*/` | Distinct institutional portals and archive pages for KRO, DBR, NZT, Noorder Cooperative Bank, De Zorglijn, Civic Lens, Atlas Registry, Waypoint Audit Office and The Signal Desk | Expanded as a fictional external source ecosystem; original company folders remain unchanged |
| `app/research-lab/institutions/Sources/` | Supplemental multi-page institutional PDFs | Added records vary in page count and evidential purpose; source register updated |
| `scripts/build-search-index.mjs` | Rebuild VINDR index | Uses local files and `pdftotext` for PDF text extraction |
| `tests/external-ecosystem.test.mjs` | Wiki, search, source and institutional integrity checks | Added to Coverage Labs automated test suite |

Preservation comparison against the V0.1.4 input archive confirmed all six company directories (Noordlicht, Rivierzorg, Kompas, Solstice, Frequency and Palisade) remained byte-identical. The entire `picker-foundation-preserved/` directory also remained byte-identical.


## V0.1.4.2 additions

- `app/workspace/` — Operator Academy, eight course modules, shared notebook, and six company profile pages.
- `app/research-lab/noordlicht/research/exhibits/NLX-2026-01.html` — incomplete procurement-boundary lead.
- `app/research-lab/rivierzorg/research/exhibits/RVX-2026-02.html` — incomplete FlowCore exception-taxonomy lead.
- `app/research-lab/kompas/research/exhibits/KPX-2026-03.html` — incomplete regional shared-desk lead.
- `app/research-lab/casebook/shared-case.html` — expanded unresolved cross-company case.
- `app/sw.js`, `app/precache-manifest.json`, `app/manifest.webmanifest` — offline learner cache and install metadata.
- `facilitator-only/` remains outside the learner app and offline cache.


## Expanded institutional and commercial network (V0.1.4.4)

- Wetering Civic Capital — investment holding, family trust interests, software and infrastructure exposure.
- Noordzee Energy & Terminals — energy importing, storage and logistics interests.
- Atlas Civic Growth Fund — private investment exposure to workflow software and outsourced administration.
- DeltaGrid Services — power balancing, backup generation and data-centre capacity; fictional DGS share quote.
- Van Wetering Family Office — family assets, property and philanthropic interests.
- North Quay Terminal — port, storage and industrial property operations.
- Meridian North Sea Energy — listed offshore oil and gas producer; fictional MNSE share quote and decommissioning exposure.

Each entity has a public site, wiki article and three source-record pages. Five insurer deployments of GoedGeregeld are recorded in the vendor archive; Kompas pre-sales records show a declined proposal rather than a production tenant.
