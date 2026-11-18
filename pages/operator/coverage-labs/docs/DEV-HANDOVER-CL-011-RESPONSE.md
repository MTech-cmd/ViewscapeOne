# DEV → MAINTAINER — V0.1.4.6 DELIVERY

**Project:** Coverage Labs  
**Milestone:** V0.1.4.6 — Landing, Sources & Academy Casebook Refinement  
**Status:** Implemented; submitted for Maintainer/Operator review

## Requested changes delivered

### Landing page
- Restored the earlier V0.1.4.3 visual language: deep navy, teal/aqua, lime accents and restrained violet.
- Kept the current open-playground architecture and the four learning panels followed by the seven world panels.
- Removed the loose shortcut/button strip immediately below the four learning panels.
- Kept the Frequency worked example link within the Frequency company panel.

### Sources directory
- Added a square brand tile to every directory entry.
- 24 tiles total: 16 institutional portals, six insurer worlds, VINDR and GoedGeregeld.
- Tiles use distinct monograms, color treatments and varied corner shapes, in the compact visual style requested.

### Academy casebook
- Brought the archived learner-facing casebook material into the Academy as native, editable panels.
- Restored the three company trails:
  - Noordlicht — corporate archaeology, member governance and procurement.
  - Rivierzorg — systems investigation, event codes, service metrics and directory definitions.
  - Kompas — household eligibility, family navigation and cooperative membership.
- Restored the shared-service investigation:
  - Network denominator comparison.
  - Service and claims metric comparison.
  - Shared administration and supplier mapping.
  - Confidence boundaries and missing-record requests.
- New fields use the existing `data-global` local autosave mechanism.
- The archived source files remain in `facilitator-only/legacy-casebook-archive/`; the learner-facing work is now available inside the Academy.

## Validation
- `npm test`: **48/48 passed**.
- VINDR rebuilt: 247 indexed local documents.
- Offline manifest rebuilt: 434 unique learner paths.
- Facilitator-only material remains excluded from the learner app and offline cache.
- ZIP integrity checked.

## Governance
V0.1.4.6 is submitted for Maintainer/Operator review and is not self-accepted. No V0.1.5 work or Picker work has been started.
