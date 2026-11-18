# Development Handover — V0.1 Initial Foundation

**Document:** DEV-HANDOVER-002  
**From:** Development (Dev)  
**To:** Operator and Maintainer  
**Version:** 0.1  
**Date:** 16 November 2026  
**Status:** Initial implementation delivered; milestone acceptance pending

## 1. Objective

Begin V0.1 following Operator instruction and establish an inspectable local-first application foundation consistent with the project and Development baseline documents.

## 2. Deliverables

- Project documentation: `PROJECT.md`, `DEVELOPMENT.md`, `RESEARCH.md`, `MAINTAINER.md`, `README.md`.
- Five provisional JSON Schemas under `schemas/`.
- Five data collections under `data/`.
- Five initial insurance group records and five representative provider records, sourced only from the project scope.
- Empty policy, claim and source collections.
- Static application: `index.html`, `styles.css`, `modules/app.js`.
- Validation, local server and CLI modules.
- Automated tests and technical records under `tests/` and `docs/`.

## 3. Technical decisions

1. HTML/CSS/browser JavaScript for an inspectable static UI.
2. JSON collections separated by entity type.
3. Node.js built-in modules for local validation, testing and serving; no third-party runtime dependencies.
4. Unknown factual values represented as `null`; unknown assessments use `rating: null` and `confidence: "unknown"`.
5. Claims and Sources contracts remain provisional pending Res review.

See `docs/DECISIONS.md` for the architecture decision records.

## 4. Tests performed

- `npm test`: 5 passed, 0 failed.
- `npm run validate`: passed; 5 groups, 5 providers, 0 policies, 0 claims, 0 sources.
- Local server smoke test: application HTML and group JSON endpoint served successfully.

Full results: `docs/TEST-RECORD.md`.

## 5. Known limitations

- No verified insurance policy data, premiums, coverage, provider networks or research claims.
- Initial group/provider relationships are unverified.
- Full JSON Schema validation is not integrated; runtime validation currently focuses on identifiers, relationships and rating invariants.
- No CRUD, import/export, persistent user editing, questionnaire, scoring or recommendation engine.
- No formal Res schema review or Operator milestone acceptance.

See `docs/KNOWN-ISSUES.md`.

## 6. Outstanding decisions

- Res: review and agree Claims/Sources schema and research vocabulary.
- Operator: review proposed architecture and provisional schemas.
- Maintainer: record dependencies, review status and project state.

## 7. Next recommended action

Submit this baseline to Maintainer for project-state integration and request Res review of the evidence contracts. Operator retains the decision to accept V0.1 and authorise V0.2.
