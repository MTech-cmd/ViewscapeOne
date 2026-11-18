# Noordlicht Zorg - Evidence Desk

> The registers are the structured research layer. The original source PDFs remain the evidence objects. Status and confidence are distinct fields.

## Claim register quick view

| Claim ID | Topic | Evidence status | Confidence | Rationale |
|---|---|---|---|---|
| CLM-01 | Legal identity | Supported | High | Annual report and registry identity records establish the fictional legal names. |
| CLM-02 | Policy terms | Supported | High | Policy guide describes the basis; actual claim-level outcomes are not modelled. |
| CLM-03 | Hospital network | Supported | High | Network annex defines the denominator; capacity and waiting time remain unknown. |
| CLM-04 | Customer service | Disputed | High | The source definitions, numerators and denominators differ materially. |
| CLM-05 | Outsourcing | Partly supported | Medium | Company schedule/technical or board appendix plus supplier register; complete data-processing terms are not public. |
| CLM-06 | Practical access | Unknown | High | No source provides a complete patient-level waiting-time distribution. |
| CLM-07 | Member governance | Disputed | High | Assembly minutes distinguish insured persons, delegates and executive procurement authority. |
| CLM-08 | Halo pathway | Disputed | High | The pathway is described across three regions; no national queue is evidenced. |

## Evidence status vocabulary

- **Supported:** the cited fictional source directly supports the bounded claim.
- **Partly supported:** the source supports only part of the claim, or a key document is missing.
- **Disputed:** available sources conflict with the wording or interpretation.
- **Unknown:** the source pack cannot establish the claim.
- **Outdated:** a newer source supersedes the evidence.

## Confidence vocabulary

Confidence describes how confidently the research team has interpreted the available evidence. It is not the same as the evidence status. A disputed conclusion may have High confidence if the source clearly disproves the broad claim.

## Source traceability rule

Use the `source_id` as the stable identifier. Record a page or section in the claim's supporting-source list. Preserve limitations and publication / verification dates. A source being official within the fiction does not make its claims independently verified.

## Registers

- `Claims_Register.csv` - atomic claims and assessments.
- `Sources_Register.csv` - source identity, dates, type, local file and limitations.
- `Open_Questions.md` - unresolved research tasks.
