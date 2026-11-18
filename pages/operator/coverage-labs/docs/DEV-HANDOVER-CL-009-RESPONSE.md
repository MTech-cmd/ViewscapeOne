# DEVELOPMENT HANDOVER — CL-009

**Project:** Coverage Labs  
**Milestone:** V0.1.4.4 — Open World & Academy Refresh  
**Package version:** `0.1.4+milestone.4`  
**Status:** Implemented; awaiting Maintainer/Operator review  
**Baseline:** Operator-uploaded `coverage-labs-v0.1.4.3-public-playground.zip`

## 1. Scope delivered

### Public learner entry
- Replaced the numbered landing-page journey with direct entry choices: Tutorial, Academy, Exam or open browsing.
- Made Academy the central workbench and first navigation item.
- Added direct browsing routes for VINDR, KennisKade, institutions, company sites and the Frequency worked example.
- Removed personal/operator-only wording from the learner-facing entry and profile navigation.

### Academy, Tutorial and Exam
- Expanded Academy from eight to ten modules.
- Added practical modules on ownership, capital, incentives, family interests, suppliers/platforms, source lineage, access, metrics and competing explanations.
- Added shared notebook fields for capital maps, motive maps, related parties and falsifiers.
- Expanded the Solstice Tutorial from seven to nine modules; added incentive analysis and competing-explanation work.
- Added exam prompts for ownership/capital mapping, commercial incentives and discriminating evidence.
- Kept the existing six reusable company profile pages and local browser save/export behaviour.

### Casebook retirement
- Removed the standalone Casebook from `app/` and therefore from the learner UI and VINDR.
- Moved its former pages into `facilitator-only/legacy-casebook-archive/`.
- Integrated the useful method into Academy: multiple hypotheses, evidence for and against, source gaps, falsifiers and bounded conclusions.

## 2. Expanded fictional information environment

### GoedGeregeld
- Expanded the corporate website, wiki, 2004–2027 history and document archive.
- Archive contains **43 individual HTML document records** and matching Markdown notes.
- Added board, ownership, investment, product, service, procurement, legal, data-processing, metric, incident, customer deployment and executive incentive material.
- VINDR sidebar and dynamic sponsored placements now link to GoedGeregeld, including on empty searches. Additional ads appear across other sites.
- GoedGeregeld's own pages/documents remain excluded from ordinary VINDR indexing; discovery is advertisement-led.
- Five insurer production deployments are documented. Kompas records show a pre-sales demonstration and declined proposal, not a production tenant. A vendor press release makes a broader adoption claim; the source trail contains the contradiction.

### Kompas
- Retained as the independent member-owned insurer and the one company without GoedGeregeld deployment or advertisements.
- Its own procurement record documents the independent open-standard stack and the reasons for declining the vendor proposal.
- Its positive characteristics are balanced by recorded governance, capacity and regional-access limitations.

### New institutions
Seven complete entities were added, each with a public site, wiki, logo and three source-record pages:
1. Wetering Civic Capital
2. Noordzee Energy & Terminals
3. Atlas Civic Growth Fund
4. DeltaGrid Services
5. Van Wetering Family Office
6. North Quay Terminal
7. Meridian North Sea Energy

The new records add ownership, financial and operational incentives, family interests, energy infrastructure, offshore oil and gas, supplier relationships and fictional share-market information (MNSE and DGS). Each entity is discoverable in VINDR. A reusable entity expansion template is in `docs/ENTITY-EXPANSION-TEMPLATE.md`.

### Existing insurer worlds
- Added source exhibits for Noordlicht, Rivierzorg and Kompas.
- Added incentive/strategy records for Frequency, Solstice and Palisade.
- Added vendor deployment records to the relevant company source registers without providing a direct route to the vendor archive.
- Preserved the six insurer logos and added logos for the seven new institutions.

## 3. Link and deployment handling

- Preserved deployment-prefix-aware links.
- Confirmed the exact previously problematic route returns HTTP 200:
  `/pages/ai/coverage-labs/app/research-lab/institutions/noorderbank/archive.html`
- Confirmed root and nested app serving through `server.mjs`.
- Relative links are used for new institution and advertisement navigation.
- Service-worker and offline manifest continue to cover only `app/`.

## 4. Validation performed

| Check | Result |
|---|---:|
| Automated tests | **44/44 passed** |
| HTML pages scanned | 172 |
| Local references checked | 1,509; zero broken/disallowed |
| VINDR local documents | 247 |
| Offline precache paths | 427 |
| Nested-prefix HTTP HEAD checks | **427/427 passed** |
| CSV source registers | 13; zero malformed rows |
| Inline JavaScript blocks | 103 parsed; zero syntax errors |
| `node --check` for key JS files | Passed |
| ZIP integrity | Checked after packaging |

Commands executed:

```bash
npm run check
node --check app/search/search.js
node --check app/workspace/workspace.js
node --check app/workspace/profile.js
node --check app/sw.js
```

## 5. Validation limitations

- No full visual browser acceptance was performed.
- No real-browser offline transition or physical-device acceptance is claimed.
- The nested-path HTTP checks verify server resolution and resource availability, not browser-side rendering or interaction.

## 6. Governance and boundaries

- V0.1.4.4 is an implementation candidate awaiting Maintainer/Operator review; it is not self-accepted.
- V0.1.5 has not started.
- The Dutch Health Insurance Picker remains untouched and separate.
- No Picker research or development has begun.
- All entities, people, events, contracts, financial data, share prices and source records remain fictional Coverage Labs simulation material.
- `facilitator-only/` and `picker-foundation-preserved/` remain outside the learner app.

## 7. Main changed areas

- `app/index.html`
- `app/workspace/`
- `app/tutorial.html`
- `app/exam.html`
- `app/search/`
- `app/goedgeregeld/`
- `app/research-lab/institutions/`
- `app/research-lab/{noordlicht,rivierzorg,kompas,frequency,solstice,palisade}/`
- `facilitator-only/legacy-casebook-archive/`
- `docs/ARCHITECTURE.md`
- `docs/SOURCE-MAP.md`
- `docs/DECISIONS.md`
- `docs/TEST-RECORD.md`
- `docs/ENTITY-EXPANSION-TEMPLATE.md`
- `docs/CHANGELOG-V0.1.4.4.md`
