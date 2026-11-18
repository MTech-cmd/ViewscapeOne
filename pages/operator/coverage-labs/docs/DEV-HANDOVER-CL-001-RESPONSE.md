# DEV → MAINTAINER — V0.1.1 INDEPENDENT FOUNDATION DELIVERY

**Document:** DEV-HANDOVER-CL-001-RESPONSE  
**Project:** Coverage Labs  
**Milestone:** V0.1.1 — Independent Foundation  
**Date:** 17 November 2026  
**Status:** Submitted for Maintainer review; not self-accepted

## 1. Delivery

Independent project: `coverage-labs-personal-v1-day1/`  
Start command: `npm run serve`  
Learner URL: `http://localhost:8000`

## 2. Resulting structure

```text
coverage-labs-personal-v1-day1/
├── app/                              # Only directory served to learner
│   ├── index.html                    # New Coverage Labs learner home
│   ├── styles.css                    # Responsive learner-home styling
│   └── research-lab/                 # Existing fictional worlds, copied intact
├── facilitator-only/                 # Outside app and server root
├── picker-foundation-preserved/
│   ├── foundation/                   # Original foundation copy
│   └── root-baseline/                # Overlapping root data/schemas/modules/tests/docs
├── docs/                             # Coverage Labs project documentation
│   └── reference/                    # Old combined portal and stylesheet snapshots
├── Tuhrict/                          # Reserved AI interactions and experiments
├── scripts/                          # Local link checker
├── tests/                            # Coverage Labs-specific tests
├── README.md
├── PROJECT.md
├── ROADMAP.md
├── package.json
└── server.mjs                        # Serves app/ only
```

The old combined-project `index.html` and `styles.css` are preserved under `docs/reference/`. They are not the new learner entry point.

## 3. Files and content handling

- Created an independent Coverage Labs project identity, README, PROJECT, ROADMAP, package scripts, static server, documentation, tests and `Tuhrict/` workspace.
- Replaced the learner entry point with a personal investigative training home. It explains the sequence, the playthrough gate, all four learning modes, the three existing worlds, the casebook, external institutions and future personal workspace.
- Copied `research-lab/` into `app/research-lab/` without changing its content. All **122 source files match byte-for-byte**, including the existing wikis, company pages, casebook, institutions and all 36 PDFs.
- Moved facilitator files to `facilitator-only/`, outside the served application directory.
- Preserved the source `foundation/` tree in `picker-foundation-preserved/foundation/`.
- Preserved the overlapping root Picker data, schemas, modules, tests and project docs in `picker-foundation-preserved/root-baseline/`; no decision was made about which historical duplicate should become authoritative.
- No fictional research records were inserted into Picker datasets. No Picker schemas or data were edited.
- No Git directory was copied into the independent project.

**Source note:** the available working input in this session was `dutch-health-insurance-picker-2027-coverage-lab-expanded.zip`. It remains untouched and recoverable in the working environment. The archive named literally in the handover text was not separately present in the mounted workspace; Dev used the available expanded Coverage Lab package rather than reconstructing a different source.

## 4. Learner experience

The home contains four explicit entry points:

1. **Tutorial company** — planned for V0.1.2 — Guided Tutorial; not falsely presented as complete.
2. **Worked example** — planned for V0.1.3 — Worked Example; not falsely presented as complete.
3. **Normal investigations** — available now through Noordlicht, Rivierzorg and Kompas, including their website, wiki, research desk and case trails.
4. **Exam company** — planned for V0.1.4 — Independent Exam Experience; no new company name or identity invented.

The page also explains the mandatory V0.1.5 Operator Playthrough gate. Future notes, saved investigations and progress are shown as planned, not as functioning features.

## 5. Verification results

### Baseline before separation

Run against the available expanded source project with Node.js v22.16.0:

- `npm test`: **16 passed, 0 failed**.
- `npm run validate`: **passed** — 5 groups, 5 providers, 0 policies, 0 claims, 0 sources.

### Independent Coverage Labs project

- `npm test`: **6 passed, 0 failed**.
- `npm run check:links`: **36 HTML pages scanned; 564 local references checked; 0 broken/disallowed references**.
- Copied research world: **122/122 file hashes match**.
- Server smoke test: learner home `200 text/html`; casebook `200 text/html`; sample source PDF `200 application/pdf`.
- Server boundary: `/facilitator-only/ANSWER_KEY.md` and `/picker-foundation-preserved/foundation/index.html` both returned **404**.

The old Picker tests remain in the preservation snapshot. The new project test command intentionally runs only `tests/*.test.mjs` so Node does not accidentally execute legacy tests from archived subdirectories under changed paths.

## 6. Mobile check

Rendered the learner home using a headless Chromium layout check at:

- Desktop: **1440 × 1000**
- Mobile: **390 × 844**
- Small mobile: **360 × 800**

At all three sizes, document width equalled viewport width; no page-level horizontal overflow remained. The mobile navigation is intentionally horizontally scrollable within its own bar. The experience cards stack vertically and world cards remain usable at the checked widths.

This is an initial responsive layout check, not a full device/browser compatibility acceptance.

## 7. Offline status

Not implemented as a formal offline/PWA capability. The content is local and the app uses no remote services, but it currently requires the included local server. No service worker, offline cache, progress persistence, saved notes or exam submission has been implemented. Facilitator material is excluded from the served app and future cache allowlists must exclude it.

## 8. Outstanding work / V0.1.2 readiness

No structural issue blocks V0.1.2. Next authorised work is the tutorial company and guided modules. Still outstanding by design:

- Tutorial company content and step-by-step modules.
- Persistence for notes and learner progress.
- Completed worked-example company.
- Independent exam company and assessment flow.
- Formal offline operation and full-device validation.

The three existing company sites were preserved rather than redesigned, as requested for V0.1.1.

**Dev submits this implementation for Maintainer review. V0.1.1 is not marked accepted by Development.**
