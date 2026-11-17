# Development Alignment Review — MAINTAINER-DEV-005

**Project:** Dutch Health Insurance Picker 2027  
**From:** Development (Dev)  
**To:** Maintainer and Operator  
**Date:** 16 November 2026  
**Status:** Structural alignment recorded; no schema or application changes made  
**Baseline:** V0.1

## 1. Review basis

This review uses the Research findings supplied in MAINTAINER-DEV-005 and the provisional schemas/data included in this V0.1 package. The complete MAINTAINER-RES-004 dossier specification was not available inside the package at the time of preparation. Consequently, this is an alignment note, not a field-by-field approval of Research's dossier definitions.

## 2. Retain / amend / add / defer

| Area | Classification | Current V0.1 position |
|---|---|---|
| Group dossier/entity | Retain | `group_id`, group records and group schema exist. Align dossier field detail with Research when the full specification is available. |
| Provider dossier/entity | Retain | `provider_id`, `group_id`, provider records and provider schema exist. Align dossier field detail with Research when available. |
| Policy dossier | Add (proposed structure only) | `policy.schema.json` is a provisional technical draft; `data/policies/index.json` is empty. A populated standalone policy dossier is not implemented. |
| Policy-year model | Defer | `policy_year` currently exists in the draft schema, but policy identity across years has not been agreed. |
| Claims register/schema | Retain as provisional draft; amend after Res alignment | `claim.schema.json` and an empty claims collection exist. They are not represented as a Research-approved formal schema. |
| Sources register/schema | Retain as provisional draft; amend after Res alignment | `source.schema.json` and an empty sources collection exist. They are not represented as a Research-approved formal schema. |
| Claim/source traceability | Amend | Claim and source drafts carry reciprocal identifier arrays. The semantic nature of each link (support, contradiction, qualification, etc.) is not yet modelled. |
| Evidence status | Amend / defer final vocabulary | Claim draft currently has a `status` field separate from `confidence`. Its enum is provisional and requires Res confirmation. Source draft has no evidence-status field. |
| Confidence | Retain / amend | Confidence exists separately in claim, source and assessment drafts. Align its scale and meaning with Research. |
| Entity relationships | Retain | Group → provider → policy foreign-key structure is present in the drafts and validation approach. Claims attach to a group, provider or policy. |
| Assessments and unknowns | Retain / defer | Assessments remain at separate group/provider/policy levels. Null ratings and unknown confidence are preserved. Criteria, weights and hard requirements remain unapproved. |
| Publication and checking dates | Retain / amend | Source draft has `publication_date` and `checked_date`; claim and assessment drafts use `last_verified`. Confirm exact definitions and whether separate checked/verified dates are needed. |
| Limitations | Retain / amend | Limitations exist on claims, sources and assessments. Research should confirm whether any limitation must be attached to a specific evidence relationship. |
| Conflicting evidence | Amend | Claim draft includes `conflicting_claim_ids`. No source-to-claim relationship type or structured conflict resolution is implemented. |

## 3. Known alignment gaps

1. **Status versus confidence:** The claim draft already has separate `status` and `confidence` fields. The status values are provisional; the source draft has confidence but no status. Research must define which evidence objects carry status and approve the vocabulary.
2. **Source relationships:** Reciprocal `source_ids` / `claim_ids` arrays identify links but do not describe whether a source supports, contradicts or qualifies a claim.
3. **Policy-year identity:** The policy draft contains `policy_year`, but it is not yet established whether each annual contract is a new policy record or a version of a continuing policy identity.
4. **Date semantics:** `publication_date`, `checked_date` and `last_verified` exist in different drafts. Their meanings and applicability need confirmation to avoid inconsistent date use.
5. **Conflicts:** `conflicting_claim_ids` is a provisional direct link between claims. It does not by itself record the nature or resolution of a disagreement.
6. **Dossier alignment:** The exact Research group/provider dossier fields cannot be confirmed without the full MAINTAINER-RES-004 material.

## 4. Minimum recommended next changes (not implemented)

- Obtain the full Research handover and map its exact dossier fields to the existing group/provider schemas.
- Agree policy-year identity before finalising the policy schema.
- Have Research define evidence-status semantics and identify which records carry status.
- Agree claim-source relationship semantics and how contradictory evidence is represented.
- Confirm date definitions and limitation placement.
- Revise the provisional schemas only after Research alignment and Operator approval.

No scoring weights, scoring calculations, recommendation logic, or research records are introduced by this package.

## 5. Operator decisions

Operator approval is required for final schema requirements, policy-year identity, evidence-status vocabulary, confidence terminology, conflict representation, assessment criteria, weights, hard requirements, and any implementation work beyond this alignment record. Research owns evidence methodology; Development translates approved methodology into technical contracts.

## 6. Preservation statement

This package preserves the V0.1 implementation baseline. No existing schema, data collection, identifier, application module, or test was changed for this alignment note. No research records were invented or added. No V0.2 functionality was started. This statement describes the package assembly; it is not formal V0.1 milestone acceptance.

## 7. Next action

Maintainer should supply the complete MAINTAINER-RES-004 document and request an exact field-level mapping. Development can then prepare a minimal proposed schema revision for Research review and Operator decision.
