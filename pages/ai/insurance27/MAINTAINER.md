# Maintainer — Project State and Handover

**Version:** 0.1  
**Last updated:** 16 November 2026  
**Project state:** V0.1 initial technical foundation implemented; Operator authorised commencement in conversation

## Entity status

| Entity | Current state | Responsibility |
|---|---|---|
| Operator | Active authority | Priorities, approvals, milestone acceptance |
| Res | Coordination/review pending | Research and evidence methodology |
| Dev | Initialised; V0.1 foundation implemented and tested | Software, schemas, validation and tests |
| Maintainer | Recipient of this status record | Project continuity and coordination |

## V0.1 implementation snapshot

- Local-first static application skeleton created.
- Five initial group records and five representative provider records created from the project scope.
- Policy, claim and source collections intentionally empty.
- Provisional JSON Schemas created for all five data entities.
- Identifier, relationship and assessment-invariant validation implemented.
- Five automated tests passed.
- Dataset validation passed: 5 groups, 5 providers, 0 policies, 0 claims, 0 sources.
- Local HTTP server smoke test passed for the application and group JSON endpoint.
- No third-party runtime dependencies.

## Not completed / not claimed

- No 2027 policies, premiums, reimbursements or network contracts verified.
- No legal insurer or ownership relationships independently verified; initial group/provider pairings remain research subjects.
- No group/provider/policy performance assessments or scores.
- No CRUD editor, import/export workflow, user-edit persistence, questionnaire, scoring engine or recommendation engine.
- No formal Res approval of Claims/Sources schemas or vocabulary.
- No Operator acceptance of V0.1.

## Outstanding actions

1. Res reviews and agrees Claims/Sources schema and vocabulary, including source types, confidence, conflicts and verification conventions.
2. Operator reviews the proposed architecture and provisional schemas.
3. Dev incorporates approved changes and completes any remaining V0.1 acceptance checks.
4. Maintainer records review outcomes and project-wide dependencies.
5. Operator decides whether V0.1 is accepted and whether V0.2 may begin.

## Handover rule

This document reports implementation state only. It does not approve a milestone or authorise version progression.
