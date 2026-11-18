# DEV-HANDOVER-CL-003-RESPONSE — V0.1.3 WORKED EXAMPLE

**Project:** Coverage Labs  
**From:** Development  
**To:** Maintainer  
**Milestone:** V0.1.3 — Worked Example  
**Date:** 17 November 2026  
**Status:** Implemented; automated and structural validation passed; submitted for review  
**Operator authority:** V0.1.2 approved; V0.1.3 acceptance pending  

---

## 1. Delivery summary

V0.1.3 adds a complete worked investigation built around a new fictional company: **FREQUENCY Health Group**. The company uses a distinctive 2002 digital cable-TV guide / sixth-generation games-console dashboard visual language: electric blue, ultraviolet, hot magenta, acid lime, CRT scanline texture, channel tiles and compact monospace navigation.

The central case is **FE-013 — One Call. One Answer?** It tests whether Frequency's public 88% first-contact resolution figure demonstrates that 88% of members' underlying problems were solved in one contact.

The learner home now links to the worked investigation and includes Frequency in the research-world directory. The company has its own public website, wiki, research desk, claim/source registers, nine multi-page PDFs and an external fictional publication, The Signal Desk.

All entities, people, contracts, metrics, records, reports and publications are fictional training material. No real-world insurer or institution is represented.

## 2. Company identity and structure

**Name:** FREQUENCY Health Group  
**Tagline:** “Care, tuned to you.”  
**Design era:** 2002 digital cable guide / sixth-generation console dashboard  
**Visual identity:** Electric blue, ultraviolet, hot magenta, acid lime, chrome-like borders, CRT scanline texture and media-channel navigation.

Fictional entities:

- **Frequency Health Group U.A.** — parent cooperative and group governance.
- **Frequency Zorg N.V.** — insurance provider; retains policy interpretation, coverage decisions and formal complaint determinations in the supplied fictional agreement.
- **Frequency Connect B.V.** — first-line member contact, identity verification, document intake, triage and case routing.
- **Frequency Network B.V.** — provider directory and network data coordination; ownership is not established by the supplied register extract.

The shared Frequency brand is deliberately broader than the legal structure. The evidence distinguishes parent ownership, provider responsibility and operational service delivery.

## 3. Files created and modified

### New learner-facing files

- `app/worked-example.html` — eight-section investigation workspace with assignment, entity map, claims, source library, evidence trail, findings, completed report and personal workspace.
- `app/research-lab/frequency/website/index.html` — Frequency public website.
- `app/research-lab/frequency/website/frequency.css` — company design system.
- `app/research-lab/frequency/wiki/index.html` — entity directory, glossary and known limitations.
- `app/research-lab/frequency/research/desk.html` — central case desk and source shelf.
- `app/research-lab/frequency/research/CLAIMS.csv` — four claim records.
- `app/research-lab/frequency/research/SOURCES.csv` — nine source records and limitations.
- `app/research-lab/frequency/Sources/` — nine four-page PDF sources (36 pages total).
- `app/research-lab/frequency/README.md` — company entry guide.
- `app/research-lab/institutions/signal-desk/index.html` — independent fictional publication.

### New facilitator file

- `facilitator-only/FREQUENCY_WORKED_EXAMPLE_GUIDE.md` — expected findings, evidence reasoning and teaching cautions.

### Modified project files

- `app/index.html` — V0.1.3 learner-home integration, worked-example link and Frequency world card.
- `app/research-lab/BRAND_IDENTITIES.md` — Frequency identity entry.
- `app/research-lab/institutions/index.html` — Signal Desk directory entry.
- `package.json` — version `0.1.3`.
- `README.md`, `PROJECT.md`, `ROADMAP.md`.
- `docs/ARCHITECTURE.md`, `docs/TEST-RECORD.md`, `docs/DECISIONS.md`, `docs/SOURCE-MAP.md`.
- `docs/DEV-HANDOVER-CL-001-RESPONSE.md` — schedule-day terminology converted to milestone terminology without changing the underlying delivery record.
- `tests/learner-home.test.mjs`, `tests/tutorial.test.mjs` — aligned to V0.1.3.
- `tests/worked-example.test.mjs` — five new worked-example tests.

## 4. Worked investigation structure

The investigation workspace contains eight navigable sections:

| Section | Content and learning outcome |
|---|---|
| 1. Assignment | Defines the central question, scope and distinction between question, claim and finding. |
| 2. Entity map | Separates parent, insurer/provider, service operator and network company; distinguishes legal ownership from contractual and operational responsibility. |
| 3. Claims | Deconstructs four public claims into testable propositions and identifies evidence needed. |
| 4. Source library | Links nine primary/secondary records and explains source purpose and limitations. |
| 5. Evidence trail | Connects claims to supporting, qualifying and contradictory evidence; separates direct evidence from inference. |
| 6. Findings | Demonstrates Supported, Partly supported, Disputed and Unknown assessments, with confidence separately stated. |
| 7. Final report | Presents a complete concise investigative report with source IDs and further-record requests. |
| 8. Your workspace | Provides personal prompts and locally saved notes to reconstruct the investigation. |

The completed investigation is inspectable throughout. It does not present the sample evidence as a representative survey or infer intent where the sources do not establish it.

## 5. Source inventory and claim/evidence relationships

All nine source PDFs have four pages each: a clearly labelled fictional cover/metadata page plus three substantive pages.

| Source ID | Document | Evidential purpose | Key limitation |
|---|---|---|---|
| FREQ-SRC-001 | Annual Signal Report 2026 | Public company claims, group presentation and reported metrics. | Self-published; not independent verification. |
| FREQ-SRC-002 | Entity Register Extract | Fictional registry snapshot and recorded parent relationships. | Frequency Network ownership is not established. |
| FREQ-SRC-003 | Member Services Agreement — Extract | Contractual allocation between Frequency Zorg and Frequency Connect. | Schedules and annexes are missing; contract does not prove performance. |
| FREQ-SRC-004 | TUNE KPI Methodology v3.2 | Defines first-contact resolution and its denominator/closure rules. | Does not measure member-level outcome or independently audit records. |
| FREQ-SRC-005 | Q4 Service Performance Dashboard | Supplies Q4 counts and reproduces the FCR calculation. | Aggregated; no member-level linkage or independent reconciliation. |
| FREQ-SRC-006 | Repeat Contact Review — Sample Ledger | Demonstrates repeat journeys and how separate IDs can hide them. | Convenience sample of 40; cannot estimate population prevalence. |
| FREQ-SRC-007 | Network Slot Availability Bulletin | Defines the 92% slot-visibility metric and feed snapshot. | Does not verify live booking, suitability or member access. |
| FREQ-SRC-008 | Board Risk Note 04/27 | Shows governance recognition of the difference between closure and outcome. | Partial extract; subsequent action completion unknown. |
| FREQ-SRC-009 | The Queue Is Not the Outcome | Secondary reporting and company response. | Small self-selected interview group; not representative. |

### Main claim relationships

- **CLM-01 — 88% first-contact resolution:** FREQ-SRC-001 states the public figure; FREQ-SRC-004 defines the calculation; FREQ-SRC-005 reproduces the result. FREQ-SRC-003 shows an interaction may be closed after transfer or next-step routing; FREQ-SRC-006 gives selected repeat-contact examples; FREQ-SRC-008 recognises the missing end-to-end member outcome measure; FREQ-SRC-009 independently explains the measurement gap.
- **CLM-02 — “One call. One answer.”:** FREQ-SRC-001 supplies the public wording; FREQ-SRC-003 distinguishes first-line contact from policy decisions and allows handoffs; FREQ-SRC-006 provides selected examples of further member action. Whether members generally complete full journeys in one contact remains unknown because no population-level linked outcome measure is supplied.
- **CLM-03 — 92% slot visibility:** FREQ-SRC-001 states the headline; FREQ-SRC-007 establishes that 1,693 of 1,840 listed locations had a slot visible in a feed. Live booking and clinical suitability remain unestablished.
- **CLM-04 — integrated group:** FREQ-SRC-002 records parent relationships for Frequency Zorg and Frequency Connect; FREQ-SRC-003 establishes contractual task allocation. Frequency Network's ownership remains unknown in the supplied extract.

### Important assessment distinction

The 88% figure is supported as a calculation of eligible interaction records marked RESOLVED at closure under TUNE v3.2. The broader proposition that 88% of member problems were solved in one contact is disputed. The true member-level resolution rate remains unknown. Evidence does not establish deliberate deception.

The dashboard count is 216,600 resolved interaction records out of 245,600 eligible interactions (88.19%, displayed as 88.2%; the annual report rounds the headline to 88%).

## 6. Feedback, interaction and progress

- The investigation is navigable through eight client-side sections.
- Sections can be marked reviewed; the progress indicator updates.
- Four personal field-note areas are available.
- Section review state and notes are stored in browser `localStorage`.
- State is local to the current browser profile/device. There is no account, sync, backup or restore.
- Marking a section reviewed is a self-directed progress marker, not a grade or proof of comprehension.
- No complex grading engine has been introduced.

## 7. Tests and actual results

Commands run from the project root:

```bash
npm test
npm run check:links
```

Results:

- Automated tests: **15/15 passed**.
- HTML pages scanned: **46**.
- Local HTML references checked: **671**.
- Broken/disallowed local HTML references: **0**.
- Frequency PDF count: **9**.
- PDF length: **4 pages each; 36 pages total** (confirmed with `pdfinfo`).
- Inline JavaScript syntax: passed with `node --check`.
- HTTP smoke tests: learner root, learner home, Solstice tutorial, worked example, Frequency website, wiki, research desk, Signal Desk, institution directory and representative PDFs returned HTTP 200.
- Direct learner-server requests for `facilitator-only/FREQUENCY_WORKED_EXAMPLE_GUIDE.md` and `picker-foundation-preserved/foundation/index.html` returned HTTP 404, as intended.
- New Frequency pages and styles have no external network/font dependency.

## 8. Preservation checks

SHA-256 file inventories compared against the V0.1.2 archive:

- Noordlicht: **32/32 files identical**.
- Rivierzorg: **32/32 files identical**.
- Kompas: **32/32 files identical**.
- Preserved Picker foundation: **46/46 files identical**.

No existing company world was redesigned. No Picker data, schema, application or research work was changed.

## 9. Mobile validation and limitations

Responsive breakpoints, wrapping navigation, stacked mobile hero/workspace layout, two-column mobile section navigation and horizontally scrollable wide tables are implemented.

A Chromium headless render attempt stalled in the execution environment and did not produce a reliable screenshot or interactive viewport measurement. Therefore a full mobile browser overflow/interaction test is **not claimed**. Operator review on an actual phone remains recommended.

Other limitations:

1. Section review is self-marked and does not assess understanding.
2. Notes are local to the current browser profile and are not exportable or backed up.
3. The case has no full underlying member-level dataset; that absence is intentional and forms part of the unresolved finding.
4. The Frequency Network ownership and missing service schedules remain unresolved in the fictional evidence set.
5. Offline readiness is not claimed.

## 10. Facilitator separation

`facilitator-only/FREQUENCY_WORKED_EXAMPLE_GUIDE.md` contains expected assessments and teaching cautions. It is outside `app/`, absent from learner navigation and returned HTTP 404 from the learner server.

## 11. Picker boundary and playthrough gate

No Picker research or development was started. The Picker foundation was checked for byte-identical preservation. The Operator's full Coverage Labs playthrough remains mandatory before Picker work can begin. V0.1.3 does not alter that gate.

## 12. Proposed next milestone — V0.1.4 Independent Exam Experience

Build a separate fictional exam company and case with no learner-facing completed answer key. The exam should require the Operator to scope the assignment, map entities, construct claims, find and assess sources, trace supporting and contradictory evidence, preserve unknowns and produce a final report. Keep expected answers and assessment criteria in `facilitator-only/`. The exam should test transfer of the method rather than repeat the Frequency case.

Do not begin V0.1.4 until Maintainer review and Operator authorisation. Do not begin Picker research or development before the mandatory playthrough gate is passed.

## 13. Submission status

**Development status:** V0.1.3 implementation complete; automated and structural validation passed.

**Maintainer review:** Requested.

**Operator acceptance:** Pending.

**Version progression:** No automatic progression requested or assumed.
