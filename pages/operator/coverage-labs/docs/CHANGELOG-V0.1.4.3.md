# V0.1.4.3 — Public Playground

Status: implementation candidate, awaiting review.

## Changes

- Fixed root-relative navigation and asset URLs for deployments mounted beneath an arbitrary path containing `/app/`.
- Updated service-worker precaching and fallback URLs to resolve against the registered app scope.
- Updated PWA start URL and scope to be relative.
- Updated the local development server to accept both `/` and a prefixed `/.../app/` URL.
- Reframed the learner-facing home and Academy as public, non-personal learning pages. Local progress remains browser-local and is not shared between visitors.
- Added brand logos for Solstice, Frequency and Palisade; retained and surfaced existing Noordlicht, Rivierzorg and Kompas logos.
- Added GoedGeregeld, a satirical ubiquitous workflow platform used in separate fictional tenants by all six insurers.
- Added GoedGeregeld corporate site, wiki, 2004–2027 timeline, 20 detailed document exhibits and document index.
- GoedGeregeld is linked from the homepage advertisement only and excluded from VINDR search results. Its references in the wider case are intentionally mundane and do not solve the shared case.

## Scope and caveats

All entities, documents, products, contracts, metrics, people and events are fictional. The public playground is not a real insurance comparison service. Browser-local progress is not cross-user or cross-device synchronised.
- Expanded GoedGeregeld's vault with 20 individual internal-record notes in Markdown, each paired with its own browsable HTML exhibit.
- Added tenant-specific background references to all six insurer world dossiers without adding a navigation link to GoedGeregeld.

## Final validation

- 41/41 automated tests passed.
- 105 HTML pages scanned; 1,264 local references checked; zero failures.
- 312/312 offline precache paths returned HTTP 200 beneath `/pages/ai/coverage-labs/app/`.
- Local server root and nested-path smoke tests passed.
- No full browser offline-transition or physical-device acceptance is claimed.
