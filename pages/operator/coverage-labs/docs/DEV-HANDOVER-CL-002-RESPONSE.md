# DEV-HANDOVER-CL-002-RESPONSE — V0.1.2 GUIDED TUTORIAL

**Project:** Coverage Labs  
**From:** Development  
**To:** Maintainer  
**Milestone:** V0.1.2 — Guided Tutorial  
**Date:** 17 November 2026  
**Status:** Implementation complete; validation performed; awaiting Maintainer review  
**Operator acceptance:** Pending  
**Tutorial identity:** SOLSTICE / Solstice Cover — provisional, awaiting Operator approval

---

## 1. Delivery summary

The V0.1.2 guided tutorial has been added to the uploaded Coverage Labs project. The learner home now links to a working seven-module tutorial. A new fictional company, Solstice Cover, has its own public website, wiki, research desk, claim/source registers and five multi-page PDF sources.

The central case investigates the company's statement that 96% of members can reach a listed care partner within 30 minutes. The source set distinguishes geographic directory proximity from practical access, including appointment availability. It also contains evidence about customer-service measurement and the division of operational/legal responsibilities.

Solstice remains a provisional identity. No permanent identity approval is assumed.

## 2. Tutorial company identity and structure

**Working name:** Solstice Cover  
**Visual identity:** Sunshine modernism — saturated yellow, coral, mint, violet and warm cream; bold geometric presentation and editorial typography.  
**Status:** Provisional; Operator approval requested.

Fictional entities:

- **Solstice Mutual Holdings U.A.** — parent/holding organisation.
- **Solstice Zorg N.V.** — named risk-bearing provider; retains policy interpretation, coverage decisions and formal complaint determination in the supplied agreement extract.
- **Dayglow Member Services B.V.** — service subsidiary performing first-line contact handling, identity checks, document intake and case routing.
- **BrightPath Data Services B.V.** — named as a supplier of certain network-directory updates. Ownership and full accountability are not established.

The public phrase “one clear team” is deliberately testable against the distinct entities and responsibilities.

## 3. Files created

### Learner-facing application

- `app/tutorial.html` — seven interactive modules, assignments, multiple-choice checkpoints, progressive feedback, field-note text areas and local progress display.
- `app/research-lab/solstice/website/index.html` — branded fictional company website.
- `app/research-lab/solstice/website/brand.css` — Solstice-specific design system.
- `app/research-lab/solstice/wiki/index.html` — company/entity wiki and known limitations.
- `app/research-lab/solstice/research/desk.html` — central case, claim list and source shelf.
- `app/research-lab/solstice/research/CLAIMS.csv` — three fictional claims.
- `app/research-lab/solstice/research/SOURCES.csv` — source register and limitations.
- `app/research-lab/solstice/README.md` — company entry guide.
- `app/research-lab/solstice/Sources/` — five multi-page PDF source documents.
- `app/research-lab/institutions/civic-lens/index.html` — new fictional independent reporting desk.

### Project and test documentation

- `README.md`
- `PROJECT.md`
- `ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/TEST-RECORD.md`
- `docs/DEV-HANDOVER-CL-002-RESPONSE.md`
- `package.json` — version updated to `0.1.2`.
- `tests/tutorial.test.mjs` — four additional tutorial-specific automated tests.
- `tests/learner-home.test.mjs` — updated to reflect the now-provisional tutorial identity.
- `facilitator-only/SOLSTICE_TUTORIAL_GUIDE.md` — expected findings and facilitator guidance.

## 4. Seven implemented modules

| Module | Learning objective | Practical assignment |
|---|---|---|
| 1. Understand the assignment | Separate question, claim and finding | Reframe the 96% statement as a testable proposition and identify assumptions to avoid |
| 2. Understand the organisation | Distinguish parent, provider and service entity | Map the entities and describe ownership, legal and operational relationships |
| 3. Deconstruct claims | Break broad promises into testable sub-claims | Identify denominator, definition, period and evidence requirements |
| 4. Find and evaluate sources | Assess source type, relevance, authority, date and limitations | Review all five PDFs and select the strongest source for the metric definition |
| 5. Build the evidence trail | Link support, qualification and contradiction to claims | Compare methodology with field reporting; distinguish direct evidence from inference |
| 6. Assess findings | Separate evidence status from confidence | Assess the broad practical-access claim and explain status/confidence separately |
| 7. Write the investigation | Produce a transparent investigative summary | Draft a 120–200 word summary using source IDs and an unresolved question |

Each module has a learning objective, assignment, links to the company website/wiki/research desk, a reasoning checkpoint, explanatory feedback and a field-note area.

## 5. Source inventory and evidence relationships

All five PDFs are three pages each and are labelled as fictional training records.

| Source ID | Document | Evidential purpose | Main limitation |
|---|---|---|---|
| SOL-SRC-001 | Group Overview | Group's own description of structure and public claims | Self-published; not a registry extract or proof of implementation |
| SOL-SRC-002 | Network Access Methodology | Defines the 96% calculation | Uses directory coordinates and estimated travel-time bands; does not test appointment availability or actual journeys |
| SOL-SRC-003 | Service Performance Report | Reports 91.2% resolved within one working day | Automated closure counts; partner-portal contacts before case-ID creation excluded; reopened cases remain in count |
| SOL-SRC-004 | Managed Services Agreement Extract | Distinguishes Dayglow first-line operations from Solstice Zorg policy/coverage/complaint decisions | Partial extract; delegation matrix and schedules absent |
| SOL-SRC-005 | The Network Percentage Problem | Secondary field reporting from 12 listed locations | Small, non-random sample; cannot establish a national rate |

Claim relationships:

- **CLM-01 — 96% within 30 minutes:** SOL-SRC-001 states the corporate claim; SOL-SRC-002 defines it as directory-coordinate proximity; SOL-SRC-005 qualifies the inference that an active listing means practical access. The national prevalence of unavailable care remains unknown.
- **CLM-02 — 90% resolved within one working day:** SOL-SRC-003 reports 91.2% under its own operational definition. Automated closure and exclusions qualify what “resolved” means.
- **CLM-03 — one group brings policy, service and network operations together:** SOL-SRC-001 describes group structure and shared brand; SOL-SRC-004 separates operational tasks and decision responsibilities. Missing schedules leave some delegation questions unresolved.

The tutorial deliberately does not label the 96% metric fraudulent. The evidence shows a narrower metric than the public wording may lead a reader to infer; it does not establish intent to mislead.

## 6. Feedback and progress

- Multiple-choice checkpoints reveal an explanation after the learner submits an answer.
- The explanations reinforce the evidential reasoning rather than merely showing a score.
- Each module has a field-note text area.
- Module completion and field notes are stored in browser `localStorage`.
- Progress is local to that browser/profile and device. There is no account, synchronisation, backup, export or restore.
- Completion is learner-marked; this is not a complex grading engine and does not verify the quality or word count of written notes.

## 7. Facilitator separation

`facilitator-only/SOLSTICE_TUTORIAL_GUIDE.md` contains expected findings, entity mapping, source/claim trails and teaching notes.

The learner server serves only `app/`. A direct HTTP request for the facilitator guide returned 404 during validation. The preserved Picker foundation also returned 404 through the learner server. Facilitator content is not linked from learner navigation or embedded in the tutorial HTML.

## 8. Preservation checks

SHA-256 inventories were taken before implementation and compared afterwards:

- Noordlicht: 32/32 files unchanged.
- Rivierzorg: 32/32 files unchanged.
- Kompas: 32/32 files unchanged.
- Preserved Picker foundation: 46/46 files unchanged.

No Picker research or development was started. No existing company world was redesigned.

## 9. Tests performed

Commands run from the project root:

```bash
npm test
npm run check:links
```

Results:

- Automated tests: **10/10 passed**.
- HTML pages scanned by local-link checker: **41**.
- Local references checked: **613**.
- Broken/disallowed local references: **0** after correction.
- JavaScript syntax check: passed with `node --check` on the extracted tutorial script.
- PDF validation: five PDFs, three pages each; `pdfinfo` recognised all five.
- HTTP smoke test: learner home, tutorial, company website, wiki, research desk, a PDF and Civic Lens returned HTTP 200.
- Facilitator guide and preserved Picker foundation paths returned HTTP 404 from the learner server, as intended.

## 10. Mobile validation and limitations

The tutorial includes a responsive layout breakpoint at 760px, a single-column mobile layout, a two-column module selector and touch-sized controls. The existing learner home retains its responsive breakpoints.

A headless browser runtime check could not be completed in this environment because browser navigation was blocked by the execution environment. Therefore, mobile layout has been implemented and statically inspected, but a full interactive viewport/overflow test is **not claimed**. Operator review on an actual mobile browser remains recommended.

## 11. Outstanding issues / known limitations

1. Solstice name and brand remain provisional pending Operator approval.
2. The module completion button is learner-controlled; it does not grade written work.
3. Local progress is browser/device-local and has no backup or sync.
4. Final report length and source-citation requirements are instructional prompts, not machine-validated.
5. Full interactive mobile browser validation remains outstanding.
6. Civic Lens is a new fictional institution; other institution identities and pages were not broadly redesigned.
7. Offline readiness is not claimed.

## 12. Versioning and next milestone

`package.json` now reports `0.1.2`. Project documentation and the learner home use milestone terminology rather than schedule-day labels.

**Proposed next milestone:** V0.1.3 — Worked Example.

Suggested scope: build a separate fictional company and a complete, inspectable finished investigation demonstrating entity mapping, claim decomposition, source selection, evidence trails, status/confidence decisions, unresolved questions and final reporting. Do not start it until Maintainer review and Operator direction.

## 13. Operator authority and gate

- V0.1.2 is submitted for Maintainer review; it is not self-approved.
- V0.1.1 acceptance remains pending unless separately accepted by the Operator.
- No automatic version progression is requested or assumed.
- The Operator's complete Coverage Labs playthrough remains mandatory.
- No Picker research or development was started or authorised by this implementation.


## Operator approval update — 17 November 2026

The Operator subsequently approved V0.1.2 — Guided Tutorial and authorised Development to proceed with V0.1.3. This approval supersedes the pending acceptance status recorded in the original submission snapshot. The Solstice identity remains provisional unless separately confirmed.
