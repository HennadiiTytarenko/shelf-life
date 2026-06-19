# Shelf Starter Instructions

Shelf is the starter repository for the **Self-Testing AI Agents** course. It is a real SvelteKit + TypeScript book application, not a generated scaffold.

## What "done" means

A task is not done until these exit zero:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`

Do not report a task complete with any of these failing. If a failure looks unrelated, say so explicitly and link the failing test name in your summary.

## Routes

- Public: `/`, `/login`, `/design-system`, `/playground`
- Protected: `/search`, `/shelf`, `/goals`, `/admin` — gate server-side on `locals.user`, never with client guards
- Do not reintroduce `src/routes/demo/` or any generated starter pages
- New routes must match the Shelf product domain (books, shelves, ratings)

## How tests get written

- Write a failing test before the implementation. Commit the test first.
- Unit tests live next to the file under test as `<name>.test.ts` and run with Vitest.
- End-to-end tests live in `tests/end-to-end/` and run with Playwright.
- The starter Playwright suite is intentionally small. Later course labs add storage state, HAR replay, dossiers, accessibility, and visual coverage.

## Playwright locator rules

- `getByRole` first. `getByLabel` or `getByText` second. `data-testid` only when semantics genuinely don't exist.
- Never use raw CSS or XPath selectors in specs.
- Never use `page.waitForTimeout` or `page.waitForLoadState('networkidle')`. Use `expect(locator).toBeVisible()`, `page.waitForResponse`, or `page.waitForRequest`.
- Do not fix a failing Playwright test by changing the assertion to match broken UI.

## UI copy

- User-facing copy stays about books, shelves, and reading. Do not mention Playwright, seeded fixtures, test IDs, HARs, or course material in rendered page copy.
- Testing rationale and infrastructure details belong in code comments, `CLAUDE.md`, or `README.md`.

## Do not

- Do not silence type errors with `any` or `@ts-expect-error`. Fix the type.
- Do not add `eslint-disable` comments. Fix the code.
- Do not add new dependencies without flagging them in your summary.
- Do not hand-edit generated artifacts or build output.

## When a test fails

- Run `npm run dossier` first. Read `playwright-report/dossier.md` before proposing a fix.
- Do not modify the assertion to make the test pass.

## Git hooks

- Never use `--no-verify` when committing. If a hook is failing, fix
  the code the hook is complaining about, not the hook.
- The pre-commit hook completes in under 10 seconds. If you see commits
  taking longer, report it.

## Playwright locators

Order of preference when locating elements:

1. `page.getByRole(role, { name })`—try this first. Always.
2. `page.getByLabel(labelText)`—for form inputs with visible labels.
3. `page.getByPlaceholder(text)`—for inputs without labels (and fix the missing label if you can).
4. `page.getByText(text)`—for static visible text and confirmation messages.
5. `page.getByTestId(id)`—only when 1–4 genuinely do not work. If you use this, add a line to the commit message explaining why.
6. `page.locator(cssSelector)`—never. If you find yourself here, the component needs an accessible name.

For nested elements, scope with chained locators, `filter({ has, hasText })`,
`and()`, and `or().first()` before reaching for `nth()`.
Use `locator.describe()` on important reusable locators so traces read like
English instead of plumbing.

## Waiting in Playwright

- Never use `page.waitForTimeout`. There is always a better option.
- Never use `page.waitForLoadState('networkidle')`.
- To wait for a UI change, use `expect(locator).toBeVisible()` or a
  similar assertion. They auto-retry up to the configured timeout.
- Do not use `locator.isVisible()` or similar boolean probes as waits.
  They answer immediately. Use retrying assertions.
- Prefer `locator.fill()` for text entry. Use `pressSequentially()` only
  when the page genuinely depends on real key events.
- To wait for a network call, set up `page.waitForResponse` with a
  URL+method matcher _before_ triggering the action.
- If you need to wait for actionability without acting, use the real
  action with `trial: true` instead of inventing a custom readiness wait.
- Use `expect.poll()` for eventually consistent values. Use `toPass()`
  only when you need to retry a whole assertion block, and set its
  timeout explicitly.
- To wait for clock-driven UI (toasts, timers, "X minutes ago"),
  install `page.clock` at the top of the test and advance it explicitly.
- If you are tempted to add a wait to "fix flakiness," stop. The flakiness
  is a symptom of an assertion not matching the actual end state. Find
  the real end state and assert on it.

## Playwright webServer

- `webServer` owns process startup and readiness only. Do not hide seed or
  migration logic inside the startup command.
- Set `use.baseURL` explicitly even when Playwright could infer it.
- Use `reuseExistingServer: !process.env.CI` unless the suite has a specific
  reason not to.
- Prefer a production-ish start command (`preview`, `start`) for end-to-end
  tests and keep dev servers for debugging.
- If startup fails and the reason is unclear, expose stdout and run again
  with `DEBUG=pw:webserver`.

## Playwright authentication

- Never log in through the UI inside a test. Login happens once, in
  `tests/authentication.setup.ts`, and all other tests inherit
  the resulting storage state.
- If a test needs a different user or role, add a new setup for that
  role and a new Playwright project that depends on it.
- Never commit `playwright/.authentication/`. It contains real session
  cookies. The docs call this folder `playwright/.auth/`; the rule is the
  same either way.
- If a test is failing because it's redirected to `/login`, the problem
  is the setup file or the session cookie TTL, not the individual test.
  Do not fix it by adding `page.goto('/login')` to the test.

## Playwright fixtures

- Name fixtures after what they _provide_, not what they _do_ (`seededReader`, not `setupUser`).
- Every fixture that mutates state has a teardown half after `await use(...)`, and the teardown is awaited.
- Worker-scope a fixture only when the data is read-only AND expensive enough to justify sharing it. Add a one-line comment justifying the choice.
- If a "fixture" is used in exactly one test, it's a helper function. Move it out of the fixtures file.
- Override Playwright's built-in `page`/`context`/`browser` with `test.extend` when the wrapper would otherwise be a helper. Don't reinvent a wrapper when an override already exists.
- Use fixture report ergonomics on purpose: hide noisy fixtures with
  `box`, use `box: 'self'` when only the wrapper is noise, and give
  important fixtures a human `title`.

## Choosing fixtures

- Use a fixture when the shared concern is actor identity, deterministic
  starting state, browser environment, or diagnostics instrumentation.
- Name fixtures after what they provide (`seededShelf`, `adminRequest`,
  `authenticatedReaderPage`), not after the implementation steps.
- If the setup is used once, keep it in the test or move it to a helper.
- If the setup mutates state, the fixture owns teardown after `await use(...)`.
- Prefer composing two small fixtures over building one giant fixture that
  hides half the test's world behind a vague name.
- When a fixture exists for diagnostics, use `testInfo` on purpose:
  `outputPath`, `snapshotPath`, `attach`, `retry`, and `setTimeout`
  are the tools, not ad-hoc temp-file math.

## Third-party authentication

- For Google OAuth, Okta, Auth0, Microsoft, SAML, or any other
  third-party provider, do not drive the provider UI in every test.
- Keep one narrow smoke test for "the sign-in flow starts."
- For the normal authenticated suite, bootstrap the application's own
  session in test or staging and save Playwright storage state from
  there.
- If the auth state lives in browser storage, capture it with
  `browserContext.storageState({ indexedDB: true })`.
- If you deliberately switch auth state mid-flow, prefer
  `browserContext.setStorageState()` over hand-mutating cookies and
  localStorage.
- Any full real-provider flow belongs in a dedicated smoke lane, not the
  normal pull-request gate.

## APIRequestContext

- Prefer API setup for state (`resetShelfContent`, `seedFreshDatabase`, direct POSTs). Reserve the UI for the behavior actually under test.
- One test, one actor by default. Add a second actor only when the behavior under test _is_ the handoff.
- For multi-actor tests, build a fixture that exposes an authenticated `APIRequestContext` via `playwright.request.newContext({ storageState })`. Do not type `request.newContext(...)`—that is not a method on the per-test fixture.
- Use `browserContext.request` when the browser page and the API call are
  the same actor and should share cookies automatically.
- Worker-scope the fixture when the session is read-only (verifying, listing). Test-scope it when the actor mutates state.
- Dispose every `APIRequestContext` you construct yourself. The test's per-test `request` fixture disposes itself; hand-built ones don't.

## HAR recording

- HAR files live in `tests/fixtures/` and are replayed via
  `page.routeFromHAR`.
- Never commit a new HAR file without a human reviewing it. HARs can
  contain credentials, session tokens, and private data from third-party
  APIs. Review in the Git diff before committing.
- Do not re-record a HAR to "fix" a failing test. If the HAR no longer
  matches the application's requests, the application changed in a way
  that deserves investigation, not a blind rerecording.
- When a HAR must be regenerated (e.g., because the upstream API
  legitimately changed), regenerate it in a standalone commit so the
  diff is clear.
- If a helper or script creates a manual browser context for HAR
  recording, close that context explicitly so the updated HAR is
  flushed to disk.
- Approved HAR refresh (the nightly CI job or a human-initiated
  re-recording workflow) is different from ad-hoc re-recording to
  silence a failing test. The refresh workflow is expected to change
  HARs; an agent fixing a red test is not.

## Route-based network mocking

- Use `page.route` with `route.fulfill` for mocking one or two endpoints
  with known responses. Use HAR replay for larger API surfaces.
- Treat routing as middleware. Use `route.fallback()` when later handlers
  still need to run; use `route.continue()` only when the chain should end.
- Use `route.abort` to simulate network failures and to block non-essential
  resources (images, fonts, analytics) that slow down tests.
- Never use `route.continue` to silently modify request headers without
  documenting why in a comment. Header manipulation is invisible in the
  test output and easy to forget about.
- Do not try to override cookies through `route.continue()`. Use
  `addCookies()` or storage state for cookie setup.
- If routes aren't intercepting as expected, check for service workers.
  Set `serviceWorkers: 'block'` in the test context when using route-based
  interception or HAR replay.
- If popup traffic or WebSockets are involved, move the interception to
  the browser context layer before debugging anything else.
- If a helper installs temporary routes, clean them up with `times`,
  `unroute()`, or `unrouteAll({ behavior: 'wait' })` before returning.

## Mocking browser APIs

- Use Playwright's first-class emulation and browser options before writing a
  custom browser API mock.
- Install custom browser API mocks with `page.addInitScript()` or
  `browserContext.addInitScript()` before navigation.
- If the app listens for browser API updates, the mock must fire the same
  events the real API would fire.
- Keep one-off mocks in the test. Move shared browser-environment contracts
  into fixtures.
- Do not fake authentication with ad-hoc `localStorage` writes when
  `storageState` or the real login flow exists.

## Database state in end-to-end tests

- Every test runs against a freshly seeded database. The seed lives in
  `tests/helpers/seed.ts`.
- Tests must not depend on data left by previous tests. If a test
  needs specific data, add it to the seed or insert it explicitly at the
  top of the test.
- Individual specs call `resetShelfContent`, which does _not_ reset user
  accounts. Only the authentication setup project uses `seedFreshDatabase`,
  because deleting users invalidates the stored browser session.
- The Shelf starter does not pin `workers` because the shipped suite is
  intentionally tiny. Once authenticated specs start sharing one SQLite
  file, treat worker-count failures as isolation bugs to fix, not as a
  reason to hard-code `workers: 1` forever.

## Hybrid API+UI tests

- Use the `request` fixture for scenario setup whenever the UI for that
  setup is already tested elsewhere. Don't click through "add book" in
  a test whose subject is the stats page.
- Treat API setup as preconditions and API reads as postconditions. Use
  them to make the test smaller, not to dodge the UI you are claiming to test.
- The action under test is always performed through the UI. If the
  test's purpose is "clicking X causes Y," do not short-circuit the
  click with an API call.
- Both `page` and `request` share the same authentication context from
  `storageState`. You do not need to attach tokens manually.
- The built-in `request` fixture already inherits Playwright config such
  as `baseURL` and default headers. Do not reconfigure it by hand unless
  you are intentionally creating a second actor.
- If you need pure API tests for an endpoint, put them in the same test
  file as the UI tests for that endpoint, using the same `request`
  fixture and no `page`.

## test.step, tags, annotations

- Every top-level user action in a test gets a `test.step('...', async () => { ... })` wrapper with a human-readable label.
- Tag every test with at least one of `@critical` / `@slow` / `@flaky-quarantine`. Never tag a test `@smoke` in Shelf — reserve that term for any future smoke-only file or project split.
- Use `test.info().annotations.push(...)` to link a test to its issue, incident, or known-flake record. Do not use annotations as a substitute for comments.
- Use `expect.soft` when a single step is verifying a list of things that should all be true. Use plain `expect` for preconditions.
- Use step options on purpose: `box: true` when the step call site is the
  useful failure location, and per-step `timeout` when one phase is slower
  than the rest of the test.
- Use `testStepInfo.skip()` when the decision is "skip this step," not
  "skip the whole test."
- Keep `test.step` nesting to two levels deep at most. If you need three, the test is doing too much.

## Playwright Test Agents

- The planner, generator, and healer agent definitions live under
  `.claude/agents/` with an MCP config in `.mcp.json`. Regenerate them
  with `npx playwright init-agents --loop=claude` after updating Playwright.
- Plans live in `specs/`. Review them before generating tests—the generator
  will faithfully implement whatever the plan says, including mistakes.
- Generated tests live in `tests/`. They are regular Playwright tests—commit
  them, review them in PRs, run them in CI.
- When a test fails after a UI change, try the healer before manually fixing
  the test. If the healer skips the test, investigate—it believes the feature
  is broken, not just the test.
- Seed tests (`seed.spec.ts`) must use the project's custom fixtures. Do not
  bypass fixtures or global setup in seed tests.

## Visual regression

- Page screenshots live in `tests/visual.spec.ts` and use
  `expect(page).toHaveScreenshot(name)`. Baselines are committed.
- Before regenerating a baseline, check that the change is intentional.
  Do not update baselines to "make the test pass."
- When a screenshot test fails, read the diff image in
  `playwright-report/` before proposing a fix.
- Dynamic regions (timestamps, user-generated content, loading
  indicators) must be masked via the `mask` option or mocked via seed
  data. Do not disable the screenshot test to work around flakiness.
- Animations are disabled globally via `playwright.config.ts`. Do not
  re-enable them per test.

## Accessibility

- After any meaningful UI change, run the automated accessibility scan
  for the affected route or component before declaring the task done.
- Treat new accessibility violations as blocking. Fix them before
  reporting completion.
- If a rule must be suppressed, scope the suppression narrowly and leave
  a sentence explaining why the component remains accessible.
- For dialogs, menus, and other complex interactions, run the manual
  keyboard checklist in addition to the automated scan.
- For UI whose accessible structure matters, add a focused ARIA snapshot
  with `toMatchAriaSnapshot()` alongside the axe scan.
- Do not claim a feature is accessible merely because Playwright locators
  use roles and labels. That is upstream pressure, not proof.

## Accessibility

- Run `tests/accessibility.spec.ts` after any meaningful UI change. Treat
  new axe violations as blocking.
- Complex UI flows (dialogs, menus, keyboard navigation) also get a
  manual pass through `docs/accessibility-smoke-checklist.md`.
- Suppressions must be scoped narrowly with a written reason in code.

## When a test fails

1. Run `npm run dossier` to generate a summary at `playwright-report/dossier.md`.
2. Read the dossier. It contains the error, screenshot path, trace path, and reproduction command for every failing test.
3. Use the reproduction command to rerun just the failing test while iterating.
4. Do not "fix" a failing test by changing the assertion. Fix the underlying code.
5. Do not add `console.log` calls to test files to debug. The trace already has the DOM at every step; open it with `npx playwright show-trace <path>`.

- Do not add `console.log` statements to test files to debug failures.
  Read the trace instead: `npx playwright show-trace <path>`. If the
  information you want is not in the trace, either add it as a
  permanent observation (network listener, console forwarder) or
  explain why it's missing.

## Flaky-test triage

- Never raise `retries` above `process.env.CI ? 2 : 0` to "fix" a flaky test. Retries are for environmental flakes only.
- When a test flakes, run it 10x locally first. 0/10 means CI-only. 1–3/10 means real flake, classify and fix. 4+/10 means it's broken, not flaky.
- Classify every flake into one of four buckets: timing race, shared state leak, order-dependent rendering, config/auth mismatch. Each has a specific fix.
- Before proposing a fix, open the trace from a failing run and cite specific evidence (DOM snapshot at failure, network timing, console output).
- Quarantine with `test.fixme` plus an issue annotation, never with `test.skip` and never with a retry bump. `fixme` stays loud; skip hides.

## Trace viewer

- Record traces intentionally: `on-first-retry` in CI, `retain-on-failure`
  when retries are off, `retain-on-failure-and-retries` when you need flake
  forensics, and `on` only while actively debugging.
- Open the trace from the failing report first, then filter to the slow or
  failing action before reading console or network noise.
- Use the trace viewer to gather evidence, not to justify a guess.
- If the trace is remote, try `show-trace <url>` or `trace.playwright.dev`
  before manually downloading artifacts.

## Reading a trace

- When a test fails, read the trace _before_ changing code. Classify the failure into one of the four buckets from the triage lesson.
- Quote specific evidence from the trace in the fix commit: the failing step name, the DOM snapshot summary, the relevant network request with status and timing, and the console output (or note it as empty).
- Never delete a trace without extracting the five dossier fields. The dossier is a contract with future-you and the next agent.
- If the timeline shows a single action taking disproportionately long, that action is the smoking gun. Start there.
- If the network pane shows a pending request at the moment of failure, suspect a timing race (bucket 1). Use `waitForResponse`, not a bumped assertion timeout.

## Runtime probing after UI changes

After any change to a file under `src/routes/` or `src/lib/components/`,
run a runtime probe before declaring the task done. The probe must:

1. Open the affected route in the browser (Playwright MCP or equivalent).
2. Take a screenshot of the changed region.
3. Interact with the change (click the button, submit the form, etc.).
4. Report what you observed after the interaction—console errors,
   network responses, visible state changes, anything unexpected.

If any step produces an error or unexpected result, fix it before
reporting the task as complete. Attach the screenshot to your summary.

## Runtime probing rules

- The dev server is running at http://localhost:5173 and should not be
  started or stopped by the agent.
- Use Playwright MCP for probing. Prefer structured accessibility
  snapshots over screenshots as the primary observation; use both for
  visual changes.
- Read the browser console after every interaction. If there is an
  error or a warning that wasn't there before your change, fix it.
- If a probe reveals a bug, fix it and re-probe before reporting the
  task as complete.

  ## Review bot findings

- When Cursor Bugbot leaves a comment, read the finding and either (a)
  fix it and push a new commit, or (b) reply on the thread explaining
  why the finding is wrong, and mark the thread resolved.
- If Bugbot flags the same issue three times across three different
  PRs, add a rule to this file that prevents the pattern upstream.
- Do not argue with Bugbot in comments. If the finding is wrong,
  resolve the thread and update `.cursor/BUGBOT.md` to prevent
  the false positive.

## Static checks

Run these before declaring a task done. They must exit zero:

- `npm run lint`—ESLint with strict custom rules
- `npm run typecheck`—TypeScript strict mode

If lint fails, read the error message. It names the violation, the
file, and the fix. Do not add `eslint-disable` comments to bypass. Do
not change a rule from `error` to `warn`. Fix the code.

If typecheck fails, fix the types. Do not use `any`. Do not use
`@ts-expect-error`. If you truly cannot type something (rare), ask
before silencing.

## Dead code

<!-- knip disabled
- Run `bun run knip` before declaring a task done. It must report zero
  findings in files you touched.
- If knip reports a file or export you added as unused, either:
  (a) complete the wiring so it's actually used, or
  (b) delete it. Do not ignore it in `knip.json` without a written
  justification.
-->

- Do not leave old code "for reference" after a refactor. Git history
  is the reference. Delete the old code.
- When removing a feature, search for every reference to the feature
  and remove them all in one commit. Do not leave the API handler
  behind after deleting the UI, or vice versa.

  ## Secrets

- Never commit a real API key, access token, password, or private key
  to this repository. Real secrets live in `.env.local` (gitignored)
  or in the deployment environment's secret manager.
- Sample configuration files (`sample-config.json`, `.env.example`)
may contain placeholder values that look like credentials. Use
obviously-fake values like `your_api_key_here`, not values that could
be mistaken for real keys.
<!-- gitleaks disabled
- Gitleaks runs in the pre-commit hook. If it flags your commit, do
  not bypass it. Remove the secret and replace it with a placeholder.
- If you believe a gitleaks finding is a false positive, add an
  allowlist entry in `.gitleaks.toml` with a comment explaining why.
  Do not add to `.gitleaksignore` without a comment.
  -->

  ## Git and verification

- Never use `--no-verify`, `HUSKY=0`, `LEFTHOOK=0`, or other hook-skipping
  flags or environment variables.
- Never weaken hook, CI, or ruleset configuration to make a failing change
  pass. Fix the code or stop and explain the blocker.
- Changes to hook configuration, workflow files, or agent policy files
  require the same review standard as application code.

  ## Guardrails

- Never bypass hooks with `--no-verify`, `HUSKY=0`, `LEFTHOOK=0`,
  `LEFTHOOK_EXCLUDE`, or similar escape hatches.
- Never modify hook, workflow, or policy configuration to make a failing
  change pass unless the task is explicitly about changing that
  configuration.
- Local hooks are convenience. CI and merge rules are authority. Keep the
  same critical checks in both places.
- Treat changes to infrastructure guardrails as high-risk edits that require
  explicit review.

## CI

- The CI workflow lives at `.github/workflows/main.yml`. Read it before
  proposing changes to the CI configuration.
- When CI fails, download the dossier artifact from the failed run:
  `gh run download <run-id> -n failure-dossier`. Read the dossier,
  reproduce the failure locally, fix it, push a new commit.
- Do not add `continue-on-error: true` to any job without written
  justification in the commit message.
- Do not reduce the strictness of CI checks to "fix" a failure. If a
  check is too strict, say so explicitly and propose the relaxation
  as a separate decision, not as part of a bug fix.
- The nightly HAR refresh opens a PR. If the diff is suspicious, do not
  merge it—investigate whether the upstream API changed in a way that
  requires application code changes.

  ## Post-merge and post-deploy

- A green pull request is not the end of the loop. After merge or after
  a deploy preview is available, run the post-deploy smoke check against
  the deployed URL.
- Use the named smoke-test command and the deployment URL provided by the
  workflow or environment.
- If the smoke check fails, treat that as a stop-ship signal. Do not
  wave the deploy through in the summary.
- If rollback conditions are met, recommend rollback explicitly instead
  of describing the failure passively.
