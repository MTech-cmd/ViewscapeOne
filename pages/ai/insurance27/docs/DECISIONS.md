# Architecture Decision Records

## ADR-001 — Local-first static foundation

**Status:** Proposed for Operator review  
**Date:** 16 November 2026

### Context

V0.1 requires an inspectable, low-dependency starting point. The project specifies editable JSON, separation of data and application logic, and no unnecessary external services.

### Decision

Use HTML, CSS and browser JavaScript for the initial interface; JSON files for seed data; Node.js built-in modules for validation, tests and a small local development server. No third-party runtime dependencies are introduced.

### Consequences

- Easy to inspect and modify.
- Works locally when served over HTTP.
- No backend, authentication, concurrent editing or robust persistence yet.
- JSON Schema files document contracts, while the current validator implements key cross-record integrity checks; full JSON Schema validation is not yet wired into the runtime.
- Revisit architecture before adding multi-user or production data workflows.

## ADR-002 — Unknown data is explicit

**Status:** Proposed baseline  
**Decision:** Unknown factual values are represented as `null` where a field is applicable; assessments use `rating: null` and `confidence: "unknown"`. Empty research collections remain empty. Missing evidence is not scored.
