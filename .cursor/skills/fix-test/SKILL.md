---
name: debug-playwright-test
description: Debug a failed Playwright test by running it with tracing, then analyzing the trace using the CLI trace tool (npx playwright trace). Use this skill whenever the user asks to debug, fix, or investigate a failing or flaky Playwright test, or when a test execution produces an error. Also triggers when the user says things like "this test is broken", "why is this test failing", "fix this test", or "investigate test failure".
disable-model-invocation: true
---

# Debug Failed Playwright Test

You are debugging a failed Playwright E2E test. Follow these steps in order.

## Step 1: Find the test

Search all `tests/**/*.spec.ts` files for the test matching the user's input (by test name, `test()` title, or keyword). Use grep to locate the exact test. Read the relevant spec file to understand what the test does.

## Step 2: Run the test with tracing

Run the specific test with tracing forced on and retries disabled:

```bash
npx playwright test -g "<exact test title>" --trace on --retries 0
```

If the test **passes**, inform the user and stop. No further debugging needed.

## Step 3: Read the terminal output

If the test **fails**, carefully read the terminal output first. Extract:

- The error message and assertion failure details
- The stack trace pointing to the failing line
- The trace zip file path (usually printed in the output under `test-results/`)

If the trace path is not visible in the output, find it:

```bash
find test-results -name "trace.zip" -newer /tmp/test-start-marker 2>/dev/null | head -5
```

## Step 4: Analyze the trace with CLI

**Important:** Use `npx playwright trace` (CLI mode), NOT `npx playwright show-trace` (which opens a GUI and will block execution).

### 4.1 Open the trace

```bash
npx playwright trace open <path-to-trace.zip>
```

### 4.2 List all actions and find the failure

```bash
npx playwright trace actions
```

Look for actions marked with `✗` — these are the failures.

To filter for specific actions (e.g., only assertions):

```bash
npx playwright trace actions --grep="expect"
```

### 4.3 Inspect the failing action

Use the action number from the list above:

```bash
npx playwright trace action <number>
```

This shows: the action type, error message, expected vs received values, timeout, and available snapshots.

### 4.4 View the page snapshot at the moment of failure

```bash
npx playwright trace snapshot <action-number> --name after
```

Use `--name before` to see the page state before the action, or `--name after` to see it after. The `after` snapshot is usually most useful for failed assertions.

### 4.5 Check network requests (if relevant)

If the failure might be related to API calls, missing data, or loading issues:

```bash
npx playwright trace requests
```

To inspect a specific request:

```bash
npx playwright trace request <request-id>
```

### 4.6 Check console messages and errors

```bash
npx playwright trace console
npx playwright trace errors
```

### 4.7 Close the trace when done

```bash
npx playwright trace close
```

## Step 5: Report findings

Provide a clear summary to the user:

- **Which test failed** — file path and test title
- **What went wrong** — the root cause (element not found, assertion mismatch, timeout, network error, missing data, etc.)
- **Evidence** — the specific error message, expected vs received values, and what the page snapshot revealed
- **Failing line** — point to the exact line in the spec file
- **Suggested fix** — a concrete code change or next step to resolve the issue

## Step 6: Apply the fix

If the root cause is clear and the fix is straightforward (wrong selector, incorrect expected value, missing wait, etc.), apply the fix directly to the spec file. Then re-run the test to verify:

```bash
npx playwright test -g "<exact test title>" --retries 0
```

If the fix is not straightforward (e.g., the application has a bug, test data is missing, or the test environment is misconfigured), explain the situation to the user and suggest next steps rather than guessing at a fix.

## Available trace commands reference

For reference, here is the full list of `npx playwright trace` subcommands:

| Command                     | Purpose                                   |
| --------------------------- | ----------------------------------------- |
| `open <trace>`              | Open a trace zip file for CLI inspection  |
| `close`                     | Close the currently open trace            |
| `actions [options]`         | List all actions (use `--grep` to filter) |
| `action <id>`               | Show details of a specific action         |
| `requests [options]`        | List network requests                     |
| `request <id>`              | Show details of a specific request        |
| `console [options]`         | Show console messages                     |
| `errors`                    | Show errors with stack traces             |
| `snapshot [options] <id>`   | View DOM snapshot for an action           |
| `screenshot [options] <id>` | Save screencast screenshot for an action  |
| `attachments`               | List trace attachments                    |
| `attachment [options] <id>` | Extract a specific attachment             |
| `help [command]`            | Show help for a command                   |
