---
name: test-failure-dossier
description: Invoke after a Playwright test fails. Produces a structured dossier and names likely root causes.
---

Run `npm run dossier`. Read `playwright-report/dossier.md`. For each failing test, output:

- the failing assertion,
- the most recent non-test file in the stack,
- the three most likely root causes with file paths,
- the bucket from the flaky-triage framework (timing, state, locator, or config).
