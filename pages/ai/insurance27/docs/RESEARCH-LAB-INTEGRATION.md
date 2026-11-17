# Research Lab integration — visual and structural pass

## Scope
The supplied `fictional_dutch_insurance_research_lab_branded` archive is integrated as a self-contained fictional research workspace under `research-lab/`. Its original Markdown dossiers, comparison notes, glossary, brand guides, logos and source PDFs are preserved.

## What changed
- Rebuilt the project root as the Coverage Lab comparison portal.
- Added locally navigable comparison cards and a side-by-side table for Noordlicht Zorg, Rivierzorg Direct and Kompas Coöperatieve Zorg.
- Refreshed each company website as a distinct branded page.
  - Noordlicht: expressive aurora / warm, optimistic.
  - Rivierzorg Direct: high-contrast futuristic digital utility; dark mode by default.
  - Kompas: cozy editorial styling, warm paper, deep violet, coral and butter yellow.
- Converted each Markdown wiki into a real `wiki/index.html` page while retaining its original `Wiki.md`.
- Converted each parent/provider research dossier into readable HTML pages while retaining the Markdown originals.
- Added local links from company pages and dossiers to wiki, comparison and PDF sources.
- Updated the local server MIME types so SVG logos and PDF sources open correctly in a browser where supported.
- Preserved the earlier V0.1 technical foundation under `foundation/` rather than overwriting or deleting it.

## Research fidelity and limitations
- All supplied company facts, figures, policy summaries, source IDs and caveats are treated as fictional source material.
- No unsupported scores, recommendations, legal conclusions or winner have been added.
- The wiki remains explicitly a secondary summary.
- The supplied research folder remains intact; HTML pages are presentation layers over the Markdown dossiers.
- The existing V0.1 JSON data model is not silently populated with these fictional insurers. The fictional research lab remains a separate workspace.

## Local use
Run `npm run serve` from the project root, then open `http://localhost:8000`.
The root comparison page links to all three local company sites, wiki pages, research dossiers and source PDFs.

## Validation status
- `npm test`: 10 tests passed (the original five tests run in both the root and preserved foundation copy).
- `npm run validate`: passed; the original V0.1 dataset remains 5 groups, 5 providers, 0 policies, 0 claims and 0 sources.
- Local HTML-link audit: 0 missing relative links across 17 HTML pages.
- All 15 fictional source PDFs are present in the package.
