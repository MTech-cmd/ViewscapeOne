# DEV-HANDOVER-CL-005-RESPONSE — EXTERNAL INFORMATION ECOSYSTEM

**Project:** Coverage Labs  
**From:** Development  
**To:** Maintainer  
**Milestone:** V0.1.4.1 — External Information Ecosystem  
**Date:** 18 November 2026  
**Status:** Implemented — submitted for review  
**Operator acceptance:** Pending

## 1. Summary

V0.1.4.1 expands the fictional external information environment around the existing Coverage Labs companies. It introduces:

1. **KennisKade:** a source-cited, editable, Wikipedia-style fictional knowledge base.
2. **VINDR:** a local search engine indexing the learner-facing Coverage Labs corpus.
3. Expanded, visually distinct institutional portals and archive pages.
4. Twelve new multi-page institutional PDFs containing 31 pages in total.
5. A source register update and automated validation for the new ecosystem.

No new insurance company was created. No Picker research or development was started.

## 2. KennisKade — editable source-cited wiki

Location: `app/wiki/`

Implemented:

- Wiki home and eight individual articles.
- Categories, article status, summaries and source lists.
- Source catalogue covering the existing local PDF corpus.
- Per-article edit mode for title, text and source IDs.
- Save validation requiring at least one recognised source ID.
- Unknown source IDs are rejected.
- Browser-local revision history.
- Per-article JSON export and reset to original simulation text.
- Responsive two-column desktop / stacked mobile layout.

Articles:

1. Wetering Civic Capital B.V.
2. Kade Data & Dossier B.V.
3. Noorder Cooperative Bank
4. Filing acknowledgement, assessment and payment receipt
5. Outsourced member administration
6. Regional provider directories and access metrics
7. Administratieve terugkeerwind
8. Dossierwarmte

The final two entries intentionally preserve odd or ambiguous internal wording. Their source does not establish a stable definition; the articles label them unresolved rather than inventing meaning.

**Editing limitation:** changes are stored in the current browser's `localStorage`. They are not written back to project files, synchronised between browsers or published to other users. JSON export is available for preserving an edited article.

## 3. VINDR — local search engine

Location: `app/search/`

Implemented:

- Search across local HTML, Markdown, CSV and PDF documents under `app/`.
- Generated corpus index: `app/search/search-index.json`.
- Title, URL and body relevance scoring.
- Exact phrase boost and basic typo tolerance.
- Result type labels, snippets and relevance ordering.
- Query-string support (`?q=...`).
- Popular search chips and index reload control.
- Fictional sponsored placements between results and in the sidebar.
- Occasional simulated search-engine glitches, including stale-index and odd-query notices.

Sponsored results use shallow fictional insurers such as GoedGeregeld, BlauwHaven, Polispoort and HeideKompas. They are labelled **“Advertentie · simulatie”** and do not link to external services. Search glitches affect presentation only; they do not alter documents or corrupt the index.

**Search boundary:** VINDR does not search the public internet. It searches the complete local learner-app corpus. The generated index currently contains 195 documents:

| Type | Indexed documents |
|---|---:|
| HTML pages | 71 |
| Markdown files | 38 |
| CSV files | 13 |
| PDFs | 73 |
| **Total** | **195** |

PDF body text is extracted using the local `pdftotext` utility when building the index. If PDF extraction is unavailable on another machine, the build script retains the PDF as a filename-level entry rather than failing the entire index build.

Rebuild the index with:

```bash
npm run build:search
```

The automated test lifecycle also rebuilds the index before tests.

## 4. Expanded external institutions

The institutional directory at `app/research-lab/institutions/` now links to distinct portals and archive pages for:

- Noorder Cooperative Bank
- Kamerregister voor Ondernemingen (KRO)
- Dienst voor Belastingen en Registratie (DBR)
- Nederlands Zorgtoezichtbureau (NZT)
- De Zorglijn
- Civic Lens
- Atlas Registry
- Waypoint Audit Office
- The Signal Desk

Each institution has its own colour palette, visual identity, publication framing and source limitations. The portals include archive pages and links to source records. The institutional directory and source README were updated.

### New institutional PDFs

Twelve supplemental PDFs were added, varying between two and three pages (31 pages total):

| Source ID | Publisher | Subject | Pages |
|---|---|---|---:|
| NCB-2026-12 | Noorder Cooperative Bank | Covenant notice and reporting schedule | 3 |
| NCB-2026-31 | Noorder Cooperative Bank | Quarterly credit monitoring excerpt | 3 |
| KRO-2026-052 | KRO | Historic trade name and officer filing | 2 |
| DBR-2026-204 | DBR | Assessment notice and payment receipt | 2 |
| NZT-2026-19 | NZT | Thematic review method and sampling note | 3 |
| NZT-2026-27 | NZT | Follow-up questionnaire and response summary | 3 |
| ZORGLIJN-2026-58 | De Zorglijn | The bank notice without a name | 3 |
| ZORGLIJN-2026-63 | De Zorglijn | The receipt is not the review | 2 |
| CIVIC-2026-22 | Civic Lens | The address that moved | 2 |
| CIVIC-2026-29 | Civic Lens | Glossary of unresolved internal phrases | 3 |
| ATLAS-2026-88 | Atlas Registry | Entity alias and identifier crosswalk | 2 |
| WAO-2026-17 | Waypoint Audit Office | Regional directory sampling protocol | 3 |

The existing one-page institutional PDFs remain present alongside these supplements. Page count is intentionally varied and is not a measure of evidential strength.

### Evidence integrity and limitations

The new records maintain the fictional evidence rules:

- The bank's 27.4% concentration notice does not identify the customer.
- The bank's performing facility status does not establish service quality or healthcare outcomes.
- Registry filings record filed identity and events, not operational control.
- DBR receipts confirm receipt or payment allocation, not substantive approval.
- NZT thematic and follow-up material is sector-level, aggregate and/or self-reported; it is not a company-specific enforcement finding.
- Newsroom and field-note material is secondary and directs researchers back to underlying records.
- The strange phrases in Civic Lens material remain undefined.

`Sources_Register.csv` includes the new records and their limitations.

## 5. Files created or modified

### Added

- `app/search/index.html`
- `app/search/search.css`
- `app/search/search.js`
- `app/search/search-index.json`
- `app/wiki/index.html`
- `app/wiki/wiki.css`
- `app/wiki/articles.json`
- `app/wiki/sources.json`
- `app/wiki/articles/*.html` (eight articles)
- Twelve PDFs under `app/research-lab/institutions/Sources/`
- Archive pages for the institutional portals
- `scripts/build-search-index.mjs`
- `tests/external-ecosystem.test.mjs`
- `docs/DEV-HANDOVER-CL-005-RESPONSE.md`

### Modified

- `app/index.html` — added VINDR, KennisKade and institutional ecosystem entry points.
- `server.mjs` — directory URLs now resolve to their `index.html` files.
- `package.json` — adds index build and pre-test lifecycle; semver build metadata encodes milestone 1 (`0.1.4+milestone.1`).
- `README.md`, `PROJECT.md`, `ROADMAP.md`.
- `docs/ARCHITECTURE.md`, `docs/TEST-RECORD.md`, `docs/SOURCE-MAP.md`, `docs/DECISIONS.md`.
- `app/research-lab/institutions/index.html`, `README.md`, `Sources_Register.csv` and institutional portal pages.
- Existing milestone test assertions now accept the semver build metadata while retaining the V0.1.4 base version.

## 6. Preservation checks

Compared against the V0.1.4 input ZIP:

- Noordlicht — unchanged, byte-identical.
- Rivierzorg — unchanged, byte-identical.
- Kompas — unchanged, byte-identical.
- Solstice — unchanged, byte-identical.
- Frequency — unchanged, byte-identical.
- Palisade — unchanged, byte-identical.
- `picker-foundation-preserved/` — unchanged, byte-identical.
- Facilitator material remains outside `app/`.

## 7. Validation results

| Check | Result |
|---|---:|
| Automated tests | 30/30 passed |
| HTML pages scanned | 71 |
| Local HTML references checked | 984 |
| Broken/disallowed local references | 0 |
| VINDR corpus | 195 documents |
| KennisKade articles | 8 |
| New institutional PDFs | 12 |
| New institutional PDF pages | 31 |
| New PDF page-count range | 2–3 pages |
| Existing company directories | 6/6 unchanged |
| Picker foundation | Byte-identical |

Commands:

```bash
npm run build:search
npm test
npm run check:links
npm run check
```

HTTP smoke tests returned 200 for the learner home, VINDR, KennisKade, a wiki article, institution directory, Noorderbank portal, archive page, search index and a new bank PDF. A request for a facilitator guide through the learner server returned 404 as expected.

JavaScript syntax checks passed for the search engine, index builder and all inline KennisKade article editor scripts.

## 8. Mobile and browser validation

Responsive layouts and mobile breakpoints are implemented for VINDR, KennisKade and institutional pages. Chromium headless visual inspection was attempted but timed out in this environment. Therefore:

- Mobile layout is **implemented but not visually browser-validated**.
- Wiki localStorage editing is **implemented and statically validated, but not end-to-end browser interaction-tested**.
- VINDR ranking and ad placement are **implemented and code-tested, but not manually browser-playtested**.
- No physical-device test is claimed.

## 9. Known limitations

1. VINDR is a local corpus search engine, not a public-web search engine.
2. VINDR's index must be rebuilt after source content changes; `npm test` rebuilds it automatically.
3. PDF text extraction depends on `pdftotext` for full-text indexing.
4. VINDR's simulated errors are deterministic query-based presentation effects, not real network failures.
5. KennisKade edits are browser-local; there is no shared editing, server persistence or automatic backup.
6. The wiki validates source IDs, not whether a cited source truly supports every sentence. Human source review remains necessary.
7. Mobile visual testing and browser interaction testing remain outstanding.

## 10. Scope confirmation

- No Picker research or development started.
- No new insurance company created.
- No changes made to the six existing company directories.
- No changes made to the preserved Picker foundation.
- No facilitator answers placed inside the learner app.
- No external service dependency introduced.
- The Operator's playthrough gate remains unchanged.

## 11. Proposed next steps

1. Maintainer reviews V0.1.4.1 and checks the new institutional source logic.
2. Operator explores VINDR and KennisKade, including the strange and unresolved entries.
3. Operator tests search results, advertisements and deliberately odd search behaviour.
4. Operator edits one or more KennisKade articles and exports a local revision.
5. Operator reviews the expanded Noorderbank, KRO, DBR, NZT and newsroom records.
6. Record usability issues and corrections for the V0.1.5 Operator Playthrough milestone.

**Development status:** V0.1.4.1 implemented and submitted.  
**Milestone status:** Awaiting Maintainer review and Operator acceptance.  
**Version progression:** No automatic progression authorised.  
**Picker work:** Not started; the playthrough gate remains mandatory.
