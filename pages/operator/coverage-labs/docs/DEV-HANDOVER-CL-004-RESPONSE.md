# DEV-HANDOVER-CL-004-RESPONSE — V0.1.4 INDEPENDENT EXAM EXPERIENCE

**Project:** Coverage Labs  
**From:** Development  
**To:** Maintainer  
**Milestone:** V0.1.4 — Independent Exam Experience  
**Date:** 18 November 2026  
**Status:** Implemented and submitted for review  
**Operator authorisation:** Approved to begin V0.1.4  
**Operator acceptance:** Pending

## 1. Summary

V0.1.4 introduces a separate fictional exam company, Palisade Civic Health Group, and an unguided investigative case: **PA-014 — Every Region, Within Reach?**

The learner must independently investigate Palisade's regional access promise, distinguish its corporate entities and operational responsibilities, test its directory metric, assess documentary evidence and write a defensible report.

The learner-facing experience contains no answer key, expected findings, suggested claim statuses or guided hints. A separate facilitator guide is stored outside the served application.

No Picker research or development was started.

## 2. New company identity

**PALISADE / Civic Route Health**

- **Design era:** late-1970s European airport terminals and civic wayfinding systems.
- **Visual language:** oversized directional typography, route arrows, ticket-stub details, timetable/document tables, high-contrast wayfinding panels and printed-paper textures.
- **Original V0.1.4 palette:** ultramarine, burnt orange, butter yellow, olive and warm cream.
- **Current palette (V0.1.4.1.1):** witchy pastel sage green and purple-goth Halloween — deep aubergine, goth purple, soft violet, pale sage, mint and ghost lilac. See `app/research-lab/palisade/README.md` for exact tokens.
- **Character:** public-service optimism, orderly navigation and an institutional promise that invites scrutiny.
- **Public promise:** “Every Region, Within Reach.”
- **Central case:** PA-014.

The identity is newly created for this milestone. All entities, policies, people, events, metrics, source records and institutions are fictional simulation material.

## 3. Corporate and service structure

The fictional source set distinguishes:

1. **Palisade Civic Health Group N.V.** — parent organisation, group strategy and governance.
2. **Palisade Zorgverzekering N.V.** — insurance provider and contracting party for the fictional 2027 Civic Route policy; policy and reimbursement decisions.
3. **Palisade Route Services B.V.** — wholly owned service company maintaining the public directory, receiving provider updates and operating member routing.
4. **Independent regional providers** — contracted counterparties; their acceptance and clinical delivery are not the same as directory presence or an insurer decision.

Atlas Registry is the fictional institutional portal for the entity extract. Waypoint Audit Office is the fictional oversight portal for the regional access review.

## 4. Files created

### Learner-facing application

- `app/exam.html` — independent exam workspace with seven work areas, source shelf, navigation, local notes and export.
- `app/research-lab/palisade/README.md` — company-world description.
- `app/research-lab/palisade/website/index.html` — public company website.
- `app/research-lab/palisade/website/brand.css` — Palisade visual identity.
- `app/research-lab/palisade/wiki/index.html` — entity and operations reference wiki.
- `app/research-lab/palisade/research/desk.html` — source desk and document index.
- `app/research-lab/palisade/research/CLAIMS.csv` — six investigative claims.
- `app/research-lab/palisade/research/SOURCES.csv` — eleven source records.
- `app/research-lab/palisade/Sources/` — eleven three-page PDFs.
- `app/research-lab/institutions/atlas-registry/index.html` — fictional registry portal.
- `app/research-lab/institutions/regional-access-office/index.html` — fictional oversight portal.

### Facilitator-only

- `facilitator-only/PALISADE_EXAM_GUIDE.md` — expected findings, illustrative claim assessments, assessment rubric, critical errors and debrief questions.

### Project and governance files modified

- `app/index.html` — exam entry point, available status, Palisade company card and six-world directory.
- `app/research-lab/institutions/index.html` — links to Atlas Registry and Waypoint Audit Office.
- `app/research-lab/README.md` — documents the Palisade simulation world.
- `README.md`, `PROJECT.md`, `ROADMAP.md` — current milestone and status updated.
- `docs/ARCHITECTURE.md`, `docs/TEST-RECORD.md`, `docs/SOURCE-MAP.md`, `docs/DECISIONS.md` — architecture, validation, source provenance and superseding milestone decisions updated.
- `package.json` — version updated to `0.1.4`.
- `tests/learner-home.test.mjs`, `tests/tutorial.test.mjs`, `tests/worked-example.test.mjs` — historical milestone assertions aligned to the current package version and company identity.
- `tests/exam.test.mjs` — seven new exam-specific tests.

## 5. Seven exam work areas

| Area | Learner assignment | Expected learning outcome |
|---|---|---|
| 00 — Assignment | Set an investigation plan and define what the central promise requires proving | Establish scope and testable investigative questions |
| 01 — Organisation | Map the parent, insurer, service company and independent providers | Distinguish ownership, legal responsibility and operational delegation |
| 02 — Claims | Deconstruct the public promise and implied metric claims | Convert broad language into testable propositions; examine definitions and denominators |
| 03 — Source desk | Navigate the website, wiki, institutional portals and original PDFs | Evaluate authority, relevance, date, scope, method and limitations |
| 04 — Evidence trail | Link claims to supporting, contradictory and qualifying records | Separate direct evidence from inference and preserve chronology |
| 05 — Findings | Assess evidence status, confidence and unknowns | Apply the project's evidence vocabulary without conflating status and confidence |
| 06 — Final report | Write a company profile, findings, citations, limitations and next steps | Produce a concise, traceable and balanced investigative dossier |

Each work area has a learner-authored notes field and a self-marked review control. The application does not reveal the intended answer.

## 6. Source inventory and claim relationships

All eleven source documents are three pages each (33 pages total).

| Source ID | Document | Main evidential purpose |
|---|---|---|
| PAL-SRC-001 | Palisade Civic Health Group — Annual Review 2025 | Parent structure, group strategy, route-presence claim and group risk |
| PAL-SRC-002 | Atlas Registry — Certified Entity Extract 26-0441 | Legal identities, ownership and registered officers |
| PAL-SRC-003 | Policy and Responsibility Schedule 2027 | Contracting insurer, coverage decision responsibility and alternative-route terms |
| PAL-SRC-004 | Intra-group Service Agreement — Route Operations | Delegated directory and routing functions and their limits |
| PAL-SRC-005 | Regional Route Directory — Methodology and Snapshot Q3 2026 | Definition, denominator, exclusions and data freshness of the 94% figure |
| PAL-SRC-006 | Route Services — Q3 2026 Operational Dashboard | Provider update latency and referral response definitions |
| PAL-SRC-007 | North Coast Provider Notice and Capacity Bulletin | Provider-originated capacity notice and receipt chronology |
| PAL-SRC-008 | Member Route Case Sample — Redacted Training Extract | Two selected route journeys and explicit sampling limitations |
| PAL-SRC-009 | Regional Access Review — Waypoint Audit Office | Independent challenge to interpretation and update-lag sample |
| PAL-SRC-010 | Public Statement — “Every Region, Within Reach” | Exact public-facing promise and its metric footnote |
| PAL-SRC-011 | Board Risk Committee Minutes — Access Metrics | Internal awareness of metric limitations and planned corrective work |

The claims register contains six claims (PAL-C01 to PAL-C06), covering the broad access promise, 94% route-presence metric, directory freshness, corporate responsibility, alternative routes and whether route presence establishes member access. Each claim record identifies relevant source IDs and an investigative question.

The documentary trail includes qualifications and contradictions. The 94% arithmetic can be reproduced as 90 of 96 region/category combinations, but the metric is defined as directory route presence, not confirmed provider capacity or completed appointments. A provider notice and selected case record challenge an unqualified interpretation of the directory, while their scope does not justify population-wide conclusions. The audit review also states its own sampling and methodological limits.

## 7. Progress and feedback behaviour

- Notes and review markers use browser `localStorage` under a Palisade-specific key.
- Seven work-area review controls drive a visible progress indicator.
- The learner can mark the exam complete; this is a self-recorded state, not a grade or assessment result.
- The export control downloads a JSON copy of the current notes, checkboxes and review state.
- There is no account, cloud sync, automatic backup, restore workflow, grading engine or server-side submission.
- No answer feedback or guided hints are provided in the learner app. Debrief material is facilitator-only.

The code is implemented and its syntax/static presence is tested. Interactive localStorage persistence and browser download behaviour were not end-to-end browser-verified in this environment.

## 8. Test commands and actual results

From the project root:

```bash
npm test
npm run check:links
npm run check
```

Results:

| Check | Result |
|---|---:|
| Automated tests | 22/22 passed |
| HTML pages scanned | 52 |
| Local references checked | 731 |
| Broken local references | 0 |
| Inline JavaScript syntax checks | 4 scripts passed `node --check` |
| Palisade PDFs | 11 × 3 pages = 33 pages |
| Existing-world and foundation preservation | 142/142 files byte-identical |
| ZIP integrity | Passed after packaging |

HTTP smoke tests returned 200 for the learner home, exam page, Palisade website, wiki, research desk and a Palisade source PDF. A request for the facilitator guide through the learner server returned 404.

## 9. Mobile validation

Responsive rules are implemented:

- Desktop: two-column exam workspace with a sticky navigation rail.
- Tablet: navigation moves above the work area.
- Mobile: single-column navigation and source shelf, stacked panel headings and compact spacing.
- Reduced-motion preferences are respected.

A headless Chromium screenshot attempt timed out. Therefore, a completed visual inspection, physical-device test and interactive mobile-browser test are not claimed. Operator review on desktop and phone remains outstanding.

## 10. Preservation and scope boundaries

SHA-256 comparison against the V0.1.3 working package confirmed **142/142 files unchanged**:

- Noordlicht: 32/32.
- Rivierzorg: 32/32.
- Kompas: 32/32.
- Preserved Picker foundation: 46/46.

The existing institutional directory was extended with two new Palisade-related portals; existing institution pages and records were not rewritten. No real-world Picker research, Picker development, schema changes or dataset changes were performed.

Facilitator guide is outside `app/`, and the local server serves only `app/`. The HTTP smoke test confirmed the facilitator guide is not available through the learner server.

## 11. Known limitations and outstanding issues

1. Operator must play the exam and assess whether the assignment is appropriately challenging.
2. Interactive browser and physical mobile validation remain outstanding.
3. Browser-local progress is device/profile-specific; export is manual and there is no backup/restore.
4. The exam does not grade or automatically assess the final report.
5. Palisade's identity is established for this fictional exam world; all records remain simulation-only.
6. V0.1.4 is submitted for review, not self-accepted as a final milestone.

## 12. Next steps

The next authorised activity should be the Operator's complete Coverage Labs playthrough and review, not automatic expansion into Picker work. Collect the Operator's observations, fix usability issues and assess the exam experience under V0.1.5 — Operator Playthrough.

**Development status:** V0.1.4 implemented; automated and structural checks passed.  
**Maintainer review:** Requested.  
**Operator acceptance:** Pending.  
**Picker work:** Not started and remains blocked by the playthrough gate.


## 14. Visual update — V0.1.4.1.1

Palisade has received a palette-only rebrand. Its public website, wiki, research desk, independent exam workspace and learner-home world card now use the witchy pastel-green / purple-goth palette. The late-1970s civic wayfinding concept, page structure, exam content, source records and all other company identities remain unchanged.
