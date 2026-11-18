# DEV → MAINTAINER — V0.1.4.2 DELIVERY

**Document:** DEV-HANDOVER-CL-007-RESPONSE  
**Project:** Coverage Labs  
**Milestone:** V0.1.4.2 — Operator Academy, six profiles and offline progress  
**Status:** Submitted for Maintainer review; not self-accepted  
**Date:** 18 November 2026

## 1. Delivery summary

V0.1.4.2 expands the first three independent company investigations, adds an unresolved cross-company case layer, turns the shared workspace into a practical research-method course, provides reusable profile pages for all six companies, and adds offline caching plus local progress persistence.

The work builds on the V0.1.4.1.1 archive. The existing Palisade palette refresh and external information ecosystem remain included.

## 2. Operator Academy — course and shared workspace

New entry point: `app/workspace/index.html`  
Learner URL: `/workspace/`

The Academy includes eight practical modules:

1. Resolve the entity before the story.
2. Turn headlines into testable claims.
3. Build a source register.
4. Assess evidence and confidence separately.
5. Triangulate, do not stack citations.
6. Test practical access.
7. Interrogate metrics.
8. Write a bounded conclusion.

Each module includes the method and an applied task. The Academy also contains a cross-company notebook for questions, priority evidence requests and a working synthesis.

Module completion is self-marked. It is a progress aid, not an assessment of competence.

## 3. Six reusable company profiles

All profile pages use the same research-method structure and save field entries locally in the browser.

| Company | Profile mode | Page |
|---|---|---|
| Noordlicht | Independent investigation | `app/workspace/profiles/noordlicht.html` |
| Rivierzorg | Independent investigation | `app/workspace/profiles/rivierzorg.html` |
| Kompas | Independent investigation | `app/workspace/profiles/kompas.html` |
| Solstice | Guided tutorial profile | `app/workspace/profiles/solstice.html` |
| Frequency | Prefilled worked example | `app/workspace/profiles/frequency.html` |
| Palisade | Independent exam profile | `app/workspace/profiles/palisade.html` |

The common profile includes:

- Identity and legal structure.
- Policy and product.
- Provider access and practical availability.
- Mental healthcare, gender-affirming care, women’s healthcare, disability/chronic illness/rehabilitation, physiotherapy and dental care.
- Service, complaints, claims handling and outsourcing.
- Governance and accountability.
- Evidence status, confidence, supported/disputed/unknown findings.
- Priority document requests and next research steps.

**Frequency:** prefilled as a worked example. The 88% calculation is described as eligible interaction records marked RESOLVED under TUNE v3.2; the broader member-level one-contact resolution claim is not presented as proven.

**Solstice:** profile page links to its seven-step guided tutorial and research desk. It is not prefilled as a completed dossier.

Each profile can be exported individually as JSON. The Academy has a combined export/import backup for module progress, shared notes and all six profiles.

## 4. First-three-company expansion and unresolved shared case

Three new fictional, explicitly limited archive exhibits have been added:

- `NLX-2026-01` — Delegate pack: procurement boundary note (Noordlicht).
- `RVX-2026-02` — FlowCore exception taxonomy: retired labels (Rivierzorg).
- `KPX-2026-03` — Regional partner circular: shared desk query (Kompas).

Each exhibit is linked from the relevant company research page and added to that company's `Sources_Register.csv`. Each contains its own limitation statement. The exhibits create further research leads but do not prove a shared command structure or deliberate wrongdoing.

The shared case at `app/research-lab/casebook/shared-case.html` now examines:

- Possible common supplier / administration relationships.
- The Wetering Civic Capital financing and registry traces.
- The differences between company network denominators.
- Missing processor schedules, service annexes and migration attachments.
- Four competing explanations: ordinary consolidation; quiet common infrastructure; fragmented systems with a common vendor; and a mixed/changing arrangement.

### Deliberate unresolved ceiling

The Operator cannot fully solve the case from the supplied corpus. No complete master agreement, end-to-end data-flow map, complete subcontractor register, customer-level linked outcomes or bank customer identity is supplied. Registry records establish filed facts, not informal control. The available evidence does not establish coordinated intent, a single hidden controller or an intent to harm members.

The expected research outcome is a defensible map with bounded findings, competing explanations, contradictions and exact missing-document requests—not a definitive conspiracy reveal. This is a deliberate evidence-design constraint, not a broken case.

## 5. Local saving and backup

Course progress, shared notes and each profile are stored in browser `localStorage` under separate Coverage Labs keys.

- Saves occur as the learner types or marks modules complete.
- No account, cloud database, server-side storage or cross-device synchronisation is implemented.
- `Export all progress` downloads a JSON backup.
- `Import backup` restores the Academy and profile data in the same browser origin.
- Each profile can also be exported individually.

**Important:** browser storage is tied to the current browser profile and origin. Clearing site data, changing browsers/devices or changing the hosted domain can make existing progress unavailable. Export backups regularly. This is local persistence, not a guarantee against browser data loss.

## 6. Offline support

Added:

- `app/sw.js` — service worker.
- `app/precache-manifest.json` — generated learner-file allowlist.
- `app/manifest.webmanifest` — installable app metadata.
- `scripts/build-offline-manifest.mjs` — rebuilds the offline allowlist.
- `npm run build:offline` — generates the manifest.

The service worker precaches the learner application, workspace, company sites, wikis, research files, source PDFs, institution portals, search index and local assets. It also caches directory aliases for offline navigation.

Only the learner `app/` tree is served and cached. `facilitator-only/` and `picker-foundation-preserved/` remain outside the application and are not in the cache manifest.

To use offline:

1. Open the deployed app online over HTTPS (or localhost).
2. Visit the learner home or Operator Academy.
3. Allow the service worker installation and cache population to finish.
4. Reopen the app while offline.

Offline availability requires a browser with service-worker and Cache API support. A first online visit is required. Browser eviction or clearing site data can remove the cache and locally saved progress. On ordinary non-localhost hosting, HTTPS is required for service workers.

## 7. Search and indexing

VINDR was rebuilt after adding the course, profiles and new exhibits.

- Indexed local documents: **205**.
- `npm run build:search` rebuilds the local search index.
- `npm run build:offline` rebuilds the offline allowlist.
- `npm test` runs both build steps before the tests.

## 8. Validation performed

Commands:

```bash
npm test
npm run check:links
npm run build:offline
```

Results:

- Automated tests: **38/38 passed**.
- HTML pages scanned: **81**.
- Local references checked: **1,040**.
- Broken/disallowed local references: **0**.
- VINDR index: **205 documents**.
- Offline manifest: **259 paths** after including directory aliases.
- HTTP HEAD smoke check of every precache path: **259 paths checked; 0 failures**.
- `node --check` passed for workspace JS, profile JS and service worker JS.
- ZIP integrity check passed.

No full browser-based offline transition, real device test or interactive browser acceptance is claimed. The static and HTTP checks establish that the required resources are present and served, not that every browser will retain them indefinitely.

## 9. Files changed / created

- `app/workspace/` — course home, modules, styles, progress logic, profile logic and six profile pages.
- `app/research-lab/{noordlicht,rivierzorg,kompas}/research/exhibits/` — three new incomplete fictional exhibits.
- Three corresponding `Sources_Register.csv` updates and company research page links.
- `app/research-lab/casebook/shared-case.html` — expanded cross-company case and explicit unresolved ceiling.
- `app/research-lab/METHOD.md` — additional method guidance for competing explanations.
- `app/sw.js`, `app/precache-manifest.json`, `app/manifest.webmanifest`.
- `scripts/build-offline-manifest.mjs`.
- `tests/operator-academy.test.mjs`.
- Updated learner home, README, PROJECT, ROADMAP, architecture, decisions, test record, package scripts and version metadata.

## 10. Preservation and boundaries

- The six existing company worlds remain present.
- Frequency's completed investigation and Solstice's guided tutorial remain separate experiences.
- Palisade's V0.1.4.1.1 palette remains included.
- Facilitator answer material remains outside the learner-served directory.
- The Picker foundation remains preserved and untouched by this milestone.
- No real-world insurer research has been started.

## 11. Submission status and next gate

**Development status:** V0.1.4.2 implemented and validated to the extent listed above.  
**Maintainer review:** Requested.  
**Operator acceptance:** Pending.  
**Version progression:** No automatic progression requested or assumed.

V0.1.5 Operator Playthrough remains the next planned milestone, but Development does not begin it without the required review/authorisation. The Operator's complete Coverage Labs playthrough remains the mandatory gate before any Picker research or development.
