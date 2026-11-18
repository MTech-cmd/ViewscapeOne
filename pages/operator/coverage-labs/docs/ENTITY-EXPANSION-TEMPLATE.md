# Coverage Labs — Entity Expansion Template

Use this structure whenever a new organisation is added to the fictional world. A named legal entity, company, public body, fund, supplier or family office should not appear as a meaningful actor without a traceable public footprint.

## Required structure

```text
app/research-lab/institutions/<entity-slug>/
├── index.html
├── assets/
│   └── logo.svg
├── website/
│   └── index.html
├── wiki/
│   └── index.html
└── documents/
    ├── annual-note.html
    ├── ownership-and-interest-register.html
    └── capital-and-contracts.html
```

## Minimum entity record

1. **Identity:** exact name, entity type, jurisdiction or fictional location, status and date.
2. **Ownership:** parent, shareholders, family vehicles, voting rights and known gaps.
3. **Purpose:** what the organisation says it does.
4. **Incentives:** commercial, financial, political, operational or reputational reasons for its decisions.
5. **Relationships:** contracts, investments, financing, suppliers, shared directors, property and infrastructure.
6. **Sources:** at least three source records with dates, authorship, scope and limitations.
7. **Logo:** local SVG asset referenced by the website, wiki and entity landing page.
8. **Directory entry:** add the entity to `app/research-lab/institutions/index.html`.

## Evidence discipline

- A shareholder is not automatically a controller.
- A contract is not proof of implementation.
- A shared supplier is not proof of shared data access.
- A financial incentive is not proof of motive or misconduct.
- A public statement is evidence of what the organisation said, not necessarily what happened.
- Record source lineage and contradictions; do not turn an inference into a fact.

## VINDR and offline support

The search index and offline cache manifest are generated from the learner `app/` tree. New HTML, Markdown, CSV, PDF, CSS, JS and SVG files are picked up by the build scripts. Run:

```bash
npm run build:search
npm run build:offline
npm run check
```

Every new entity must be discoverable in VINDR through its website, wiki and source documents. Do not create named counterparties casually: either give them the same complete footprint or keep them generic in the source text.
