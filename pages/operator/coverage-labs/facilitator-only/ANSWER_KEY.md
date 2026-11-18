# FACILITATOR ONLY - ANSWER KEY

> **Do not distribute with the public-facing casebook.** This file contains intended answers and clue mapping for the fictional Coverage Lab research simulation. It is not shown or linked from the websites.

## Case 01 - Noordlicht: member ownership and supplier authority

### Intended answer

Noordlicht's member-owned label does not mean every insured person directly votes on every operational decision. `NOORDLICHT-SRC-006` records 41 voting delegates, written questions and an assembly model. It says the member council may advise on strategy but the executive board retains individual supplier-procurement authority. Therefore, the accurate finding is: **a cooperative governance structure exists, but the available record does not establish direct member control over individual supplier contracts**.

### Evidence path

1. `NOORDLICHT-SRC-001` - annual report: group structure / member council.
2. `NOORDLICHT-SRC-006` - assembly minutes: delegate voting and procurement authority.
3. `NOORDLICHT-SRC-009` - KRO extract: Kade Data & Dossier B.V. is a separate registered supplier; service relationship does not prove ownership.
4. `NOORDLICHT-SRC-010` - procurement schedule: supplier work includes document intake and first-line file preparation; final claim decision and payment authorisation remain with Noordlicht.

### Boundary

Do not conclude that Kade owns Noordlicht or has authority to decide policy claims. The documents show an administrative supplier relationship and retained insurer decision rights. The full signed contract, processing annex, subcontractor list and independent audit are still missing.

## Case 02 - Rivierzorg: what the service metrics measure

### Intended answer

The 82% “within two working days” metric covers routine claims with complete machine-readable fields and no manual-document requirement, completed in the measured app channel. It excludes rejected, duplicate, pending-document, manually reviewed and escalated cases. It is not an all-claims success rate.

### Evidence path

1. `RIVIERZORG-SRC-006` - FlowCore architecture: event labels include CASE_ACCEPTED, DOCUMENT_PENDING, HUMAN_REVIEW and PAYMENT_RELEASED; Kade Relay is the exception/document route.
2. `RIVIERZORG-SRC-008` - incident review: a 14-hour relay interruption affected document-dependent files; routine app claims continued; 7,420 files were affected and 96% released within two working days according to the company.
3. `RIVIERZORG-SRC-009` - metric note: 82% applies only to routine machine-readable completed app claims and excludes several categories.
4. `RIVIERZORG-SRC-010` - managed services schedule: names Kade Data & Dossier B.V. as the operator of document relay and exception queue.
5. `KRO-2026-041` - external register extract: identifies Kade and its shareholder Wetering Civic Capital B.V.

### Boundary

The architecture and schedule indicate the operational design and named supplier, but do not establish actual day-to-day performance, all subcontractors, processing locations or complete security controls. Do not treat the incident as proof of a legal breach.

## Case 03 - Kompas: family eligibility and cooperative membership

### Intended answer

Kompas uses at least three distinct person categories:

- Insured person: included under the health policy.
- Family Support eligible person: policyholder, registered partner and dependent child aged 0-17 listed on the household record; broader relatives may receive signposting but not default named navigation.
- Cooperative voting member: separately registered member; the 2025 record shows 18,460 eligible voting members against 250,000 insured persons.

A family policy does not automatically make every insured household member a cooperative voting member, and the Family Support service is not a benefit for every relative.

### Evidence path

1. `KOMPAS-SRC-006` - member assembly record: 250,000 insured versus 18,460 voting members; voting rights attach to membership.
2. `KOMPAS-SRC-007` - family route handbook: identifies eligible household roles and age boundary.
3. `KOMPAS-SRC-008` - regional ledger: 95% counts hospital organisations with any active agreement and the enhanced navigation service is concentrated in three core provinces.
4. `KOMPAS-SRC-010` - redacted board appendix: supplier code KDD-04; do not identify the supplier from that code alone without cross-source corroboration.

### Boundary

Do not say that the family service changes policy coverage or guarantees capacity. Do not say every household member can vote. The minutes do not provide the complete membership register or proxy-vote record.

## Case 04 - Cross-company shared-service question

### Intended answer

The strongest supported conclusion is that **all three fictional insurers have a relationship with the same external administrative service provider, Kade Data & Dossier B.V., for different aspects of document handling or exception administration**.

The three records reveal the relationship differently:

- Noordlicht SRC010 names Kade directly in a procurement schedule.
- Rivierzorg SRC010 names Kade as FlowCore's document-relay and exception-queue operator.
- Kompas SRC010 redacts the supplier name but leaves code `KDD-04` in an annex index. Cross-reference with KRO and the newsroom to form a lead, but treat supplier-code mapping as partly supported unless the full contract confirms it.
- `KRO-2026-041` records Kade as an independent company and Wetering Civic Capital B.V. as sole shareholder in the 2024 control update.
- `DBR-2026-119` is only a filing acknowledgement. It does not certify the underlying accounts or tax compliance.
- `NCB-2025-77` describes a receivables facility for Wetering Civic Capital group and a concentration covenant; the public schedule does not identify specific insurer customers.
- `NZT-2026-08` is a sector-level thematic note, not a finding against these insurers.
- The Zorglijn articles are investigative leads; they do not replace signed contracts or a complete processor register.

### What is NOT established

- That Kade owns or controls any insurer.
- That the insurers have common ownership or a shared risk carrier.
- That Kade makes clinical decisions or final claim-approval decisions.
- That the arrangement is unlawful, unsafe or non-compliant.
- That the three organisations share exactly the same data, subcontractors or processing locations.

### What evidence would close the gaps

The signed master services agreement, insurer-specific schedules, data-processing agreements, subcontractor register, data-location statement, independent security/controls audit, incident log and exit/portability test.

## Metric puzzle - network percentages

The three figures are not comparable:

- Noordlicht 92%: 82 of 89 hospital organisation entries with active general agreements.
- Rivierzorg 78%: hospital addresses marked ACTIVE in a directory export. One organisation can have multiple addresses.
- Kompas 95%: hospital organisations with any active agreement; not a site count or specialty count.

None measures appointment capacity, treatment-level contracts, referral acceptance or waiting time. There is no valid cross-company ranking from the headlines alone.

## Metric puzzle - complaints

- Noordlicht 3.8 / 1,000: formal complaints under internal escalation definition; excludes first-contact closures, forwarded provider complaints without a Noordlicht case ID and some supplier-handled contacts; denominator is average insured persons.
- Rivierzorg 5.6 / 1,000: tagged support tickets, including app/login problems, divided by active digital accounts.
- Kompas 3.1 / 1,000: upheld formal complaints divided by year-end insured persons.

The metrics cannot be compared directly. More data is required before ranking customer outcomes.

## Suggested scoring rubric for facilitators

Award full credit when the learner:
1. Uses at least two primary sources for each material conclusion.
2. Separates identity, ownership, control and service relationships.
3. Reconstructs numerator/denominator and exclusions rather than copying headline percentages.
4. Uses evidence status separately from confidence.
5. States what remains unknown and names the next source needed.
6. Avoids unsupported allegations about legal compliance, data misuse, corporate ownership or care quality.

## Canonical clue map

See `CLUE_MAP.csv` for source-to-question mapping. This is a training scenario, not a hidden real-world investigation.
