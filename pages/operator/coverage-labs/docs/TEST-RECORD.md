# Test Record — Coverage Labs V0.1.4.1

## Automated validation

- `npm test` — **22/22 tests passed**.
- `npm run check:links` — **52 HTML pages scanned; 731 local references checked; zero missing or disallowed references**.
- Inline JavaScript syntax — **4 scripts passed `node --check`**.
- Palisade source PDFs — **11 documents, 3 pages each (33 pages total)**; page counts checked with `pdfinfo`.
- Preservation comparison against the V0.1.3 package — **142/142 files byte-identical** across Noordlicht (32), Rivierzorg (32), Kompas (32) and the preserved Picker foundation (46).
- HTTP smoke tests — learner home, exam page, Palisade website, wiki, research desk and a source PDF returned HTTP 200.
- Facilitator path smoke test — facilitator guide request returned HTTP 404 from the learner server.
- ZIP integrity checked after packaging.

## Browser and mobile validation

Responsive CSS breakpoints are implemented for tablet and mobile layouts, including a stacked exam workspace, single-column source shelf and touch-sized controls. The headless Chromium screenshot attempt timed out in this environment. Therefore, a completed visual browser inspection, live localStorage interaction test and physical-device mobile test are **not claimed**. Operator review on desktop and an actual phone remains outstanding.

## Commands

```bash
npm test
npm run check:links
npm run check
```


## V0.1.4.1 — External Information Ecosystem

Validation is recorded in `DEV-HANDOVER-CL-005-RESPONSE.md`. Search index generation is part of `pretest`; the corpus is rebuilt before the automated suite runs. VINDR indexes local HTML, Markdown, CSV and PDF documents. KennisKade source-ID validation and article inventory are covered by dedicated tests.

### V0.1.4.1 recorded validation

- `npm run check` — **30/30 automated tests passed**; **71 HTML pages scanned; 984 local references checked; zero broken or disallowed references**.
- VINDR generated index — **195 local documents**: 71 HTML pages, 38 Markdown files, 13 CSV files and 73 PDFs. The index includes extracted PDF text when `pdftotext` is available.
- KennisKade — **8 articles**; every article has one or more source IDs that resolve against the local source catalogue; inline editor scripts compile.
- Institutional supplements — **12 new PDFs / 31 pages**, with individual documents ranging from 2 to 3 pages. Original one-page institutional records remain available alongside them.
- HTTP smoke tests — learner home, VINDR, KennisKade, institution directory, bank portal, archive page, wiki article, search index and a new bank PDF returned HTTP 200. Facilitator guide request returned HTTP 404.
- Preservation comparison against the V0.1.4 ZIP — Noordlicht, Rivierzorg, Kompas, Solstice, Frequency and Palisade company directories remained byte-identical; `picker-foundation-preserved/` remained byte-identical.
- Desktop/mobile Chromium visual inspection was attempted but timed out in this environment. Responsive CSS is present; visual browser and physical-device testing remain outstanding.


## V0.1.4.1.1 — Palisade palette refresh

- `npm run check` — **31/31 automated tests passed**; **71 HTML pages scanned; 984 local references checked; zero broken or disallowed references**.
- Palisade palette consistency is tested across the public website stylesheet, wiki, research desk, independent exam workspace and Coverage Labs learner-home card.
- VINDR rebuilt successfully with **195 local documents**.
- No Palisade source PDFs, claims, source-register rows or fictional evidential content were edited.
- No visual browser screenshot or physical-device test is claimed.


## V0.1.4.2 — Operator Academy and offline progress

- Automated test suite: **38/38 passed**.
- HTML link checker: **81 pages, 1,040 local references; zero broken references**.
- VINDR index: **205 local documents**.
- Offline cache manifest: **259 paths** verified with HTTP HEAD requests; zero missing resources. It is generated from the learner `app/` tree only; facilitator-only material is outside the served tree.
- Browser-level offline transition and physical-device testing remain pending; localStorage persistence is implemented but depends on the browser retaining site data.


## V0.1.4.4 — Open World & Academy Refresh validation

- `npm run check` — **44/44 automated tests passed**.
- HTML link checker — **172 HTML pages scanned; 1,509 local references checked; zero broken or disallowed references**.
- VINDR — **247 local documents indexed**. GoedGeregeld's own 43 document pages remain excluded from ordinary search; sponsored ads link to its site.
- Offline manifest — **427 unique learner paths** generated from `app/` only.
- Nested deployment smoke test — **427/427 HTTP HEAD requests passed** under `/pages/ai/coverage-labs/app/`.
- Inline JavaScript — **103 script blocks parsed; zero syntax errors**.
- **13 CSV source registers** checked; zero malformed rows.
- **103 inline JavaScript blocks** parsed; zero syntax errors.
- Kompas has no GoedGeregeld advertisement or production deployment; the vendor archive records a declined pre-sales proposal, cross-checkable against Kompas procurement records.
- Browser visual inspection, full offline transition in a real browser and physical-device acceptance are not claimed.
