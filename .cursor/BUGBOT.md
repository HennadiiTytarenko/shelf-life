# Bugbot review rules for Shelf

## Context

Shelf is a reading-tracker built on [SvelteKit](https://kit.svelte.dev/) + TypeScript + [Drizzle](https://orm.drizzle.team/) + SQLite.
Tests run on [Vitest](https://vitest.dev/) (unit) and [Playwright](https://playwright.dev/) (end-to-end). [Better Auth](https://www.better-auth.com/) handles
authentication; authorization helpers live in `src/lib/server/authorization.ts`.

## What to flag

- API handlers under `src/routes/api/` that read user identity from the
  request body instead of the viewer. User identity comes from `locals.user`,
  never the request body.
- Admin-only route handlers that use plain `locals.user` checks or call
  something other than `requireAdministrator(locals.user)` from
  `$lib/server/authorization`. Any handler under `src/routes/api/admin/**` is
  admin-only.
- Drizzle queries that don't scope by the current user when operating on
  user-owned resources (shelf entries, ratings).
- Error handling that catches an error and returns 200. If we catch, we log
  and return an appropriate non-2xx status.
- Components that render user-generated content without escaping or
  sanitization.
- Playwright tests that use `page.waitForTimeout`, `page.locator` with raw
  CSS, or UI login. These patterns are banned by the agent rules.
- Changes to the dossier loop that remove `playwright-report/report.json`,
  retained traces, or the `npm run dossier` script.

## What to leave alone

- Generated Playwright artifacts under `playwright-report/`.
- Storage-state files under `playwright/.authentication/`.
- Snapshot PNGs in `tests/*-snapshots/`.
- HAR fixtures under `tests/fixtures/*.har`.
- Generated `build/` outputs.
- Lockfiles.

## Tone

Be direct. Name the line. Suggest a specific fix. Do not write
"consider," do not write "you may want to," do not summarize the PR.
If nothing is worth flagging, say nothing.
