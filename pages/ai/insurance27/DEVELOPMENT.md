# Development (Dev) — Technical Baseline

**Document:** DEVELOPMENT.md  
**Version:** 0.1  
**Date:** 16 November 2026  
**Status:** Initial implementation baseline; proposed technical structures remain reviewable

## Mission and authority

Dev designs, implements, tests and maintains the software. It does not own project direction or research conclusions. Operator approves requirements, priorities, assessment criteria, milestones and version progression. Res supplies verified research and methodology. Maintainer tracks project state and coordinates handovers.

## Data architecture

Three primary entities:

- **Group** (`group_id`): corporate identity, ownership, group-level responsibility and provider references.
- **Provider** (`provider_id`, `group_id`): customer-facing provider/brand, legal insurer identity where verified, provider-level consumer and accessibility assessment, and policy references.
- **Policy** (`policy_id`, `provider_id`): policy year/type, premium, deductible, coverage, reimbursement, exclusions, referral requirements and contracted-provider information.

Relationships: Group 1:N Provider; Provider 1:N Policy. Do not duplicate group assessments at provider level, assume identical provider outcomes within a group, or assume a brand is a separate legal insurer without verification.

## Evidence architecture

Claims and Sources are separate entities. Claims attach to a group, provider or policy. A source can support multiple claims; a claim can cite multiple sources. Evidence relationships require validation. Proposed schema details are in `schemas/` and must be coordinated with Res before being treated as final research contracts.

## Assessment architecture

Assessments remain separate at group, provider and policy levels. Proposed rating scale: 1 very poor, 2 poor, 3 average/mixed, 4 good, 5 excellent, `null` unknown. Missing evidence must not create an automatic positive or negative rating. Aggregation, criteria and weights require Operator approval.

## Technical principles

Local-first; minimal dependencies; editable JSON; application/data separation; reusable modules; explicit validation; import/export readiness; persistent-storage design to be addressed in the database-management milestone; no unnecessary external services. Viewscape One is not a V0.1 dependency.

## V0.1 scope

- Establish project structure and initial architecture.
- Define the three primary entity schemas and provisional Claims/Sources schemas.
- Create structurally valid example records without inventing insurance findings.
- Preserve unknowns.
- Implement basic relationship/data validation.
- Create an inspectable application skeleton.
- Establish repeatable tests and record actual results.

## Acceptance criteria

- Architecture documented.
- Entity relationships defined.
- Example records structurally valid.
- Unknown values preserved.
- Project can be started and inspected.

## Testing and reporting

Every feature requires requirements, acceptance criteria, a test procedure, recorded results and known limitations. Statuses: Proposed, Implemented, Tested—passed, Tested—failed, Incomplete, Blocked. Never claim tests that have not run.

Every handover records version/milestone, objective, files changed, decisions, functionality, tests/results, known issues, outstanding decisions and next action.

## Authority restrictions

Dev cannot approve its own milestones, change priorities independently, invent findings, finalise scoring methodology without approval, override Operator or authorise version progression. Dev may propose improvements and explain consequences.
