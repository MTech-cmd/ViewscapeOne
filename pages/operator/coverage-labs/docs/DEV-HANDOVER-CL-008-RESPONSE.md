# DEV HANDOVER — CL-008 RESPONSE

**Project:** Coverage Labs  
**Milestone:** V0.1.4.3 — Public Playground  
**Status:** Implemented; awaiting Maintainer/Operator review  
**Role:** Development

## 1. Operator request implemented

- Corrected application routing for installations served below a nested deployment path, including `/pages/ai/coverage-labs/app/`.
- Reframed the learner-facing product as a public fictional investigative-journalism playground rather than a personal/operator-only workspace.
- Added visible logos for all six fictional insurer companies.
- Created GoedGeregeld as a deliberately satirical, extensively documented workflow-software company used by all six insurers.
- Kept GoedGeregeld discoverable through the homepage advertisement only; it is excluded from VINDR search and has no links from the normal company navigation.
- Allowed modest additional background detail for the six insurer worlds.

## 2. Deployment-path correction

A small runtime path resolver is inserted into the existing HTML pages. It detects the app mount point by locating `/app/` in the current pathname and rewrites root-relative `href`, `src`, `action`, `poster` and `data` attributes to use that mount point.

The service worker now resolves its manifest, cache entries and offline navigation fallback against `self.registration.scope`. The PWA manifest uses relative `start_url` and `scope`. The local Node server also accepts both root paths and paths containing a nested `/app/` mount.

This fixes the distinction between the broken domain-root URL and the working nested URL supplied by the Operator.

## 3. Public learner framing

- Home page and Investigator Academy copy now describe a public learning environment.
- No account, central progress database or cross-visitor synchronisation has been introduced.
- Course and profile progress remains local to each browser profile and origin.
- Facilitator-only material and Picker foundation remain outside the served `app/` directory.

## 4. Company logos

The six insurer websites now visibly use their logo assets:

- Noordlicht
- Rivierzorg
- Kompas
- Solstice
- Frequency
- Palisade

GoedGeregeld has a separate seventh logo used by its microsite and advert.

## 5. GoedGeregeld fictional side-world

Created under `app/goedgeregeld/`:

- Corporate website and product overview
- Dedicated wiki with 15+ entries covering products, history, metrics, governance, people, incidents, acquisitions and customer deployments
- Corporate timeline spanning 2004–2027 with 17 milestone entries
- Document vault with 20 individually browsable HTML exhibits
- 20 paired Markdown internal-record notes
- Separate customer configuration exhibits for all six insurers
- Satirical product, governance and KPI language

GoedGeregeld is a workflow/collaboration platform analogous to ubiquitous workplace software. Each insurer uses a separate tenant and module. Its use does not establish shared member data, common ownership, common decision-making, coordinated intent or responsibility for insurer outcomes. The expanded case remains unresolved.

The only cross-site entry point is the homepage advertisement. GoedGeregeld files are omitted from VINDR indexing. Internal links within GoedGeregeld work normally once the advertisement has been followed.

## 6. Validation performed

- `npm test`: **41/41 automated tests passed** after the final paired Markdown document expansion.
- `npm run check:links`: **105 HTML pages scanned; 1,264 local references checked; zero broken/disallowed references.**
- Prefixed-path HTTP HEAD smoke test: **312/312 precache paths returned HTTP 200** beneath the supplied nested deployment prefix.
- Local server smoke tests: root home, supplied nested archive URL and GoedGeregeld homepage each returned HTTP 200.
- JavaScript syntax checks passed for service worker, workspace and profile scripts.
- Local server smoke tests: root home, supplied nested archive URL and GoedGeregeld homepage each returned HTTP 200.

No full browser-based visual acceptance, real-device test or complete browser offline-transition test is claimed.

## 7. Governance and next step

V0.1.4.3 is an implementation candidate awaiting review. Development does not self-approve it. V0.1.5 is not started. No Dutch Health Insurance Picker research or development has begun or is authorised by this handover.
