# Test Record

**Baseline:** V0.1 initial implementation  
**Date:** 16 November 2026  
**Runtime:** Node.js v22.  

## Automated tests

Command: `npm test`

Result: **5 passed, 0 failed.**

- Seed dataset has unique identifiers and valid references — passed.
- Unknown assessments remain null and are not assigned a score — passed.
- Validator detects broken provider-to-group relationship — passed.
- Validator detects duplicate identifiers — passed.
- Validator rejects a numeric rating outside the defined scale — passed.

## Dataset validation

Command: `npm run validate`

Result: **Passed.** Counts: 5 groups, 5 providers, 0 policies, 0 claims, 0 sources. No identifier or relationship errors.

## Local server smoke test

Command: `npm run serve`, followed by HTTP requests to `/` and `/data/groups/index.json`.

Result: **Passed.** Application HTML and group JSON were served successfully.

## Limitations

These tests do not establish the accuracy of insurance facts, legal relationships, policy conditions or research conclusions. JSON Schema files were parsed as JSON during creation but full JSON Schema validation is not yet integrated into the test runner.
