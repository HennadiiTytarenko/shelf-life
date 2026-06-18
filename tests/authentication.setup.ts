import { test as setup, expect } from '@playwright/test';
import path from 'node:path';
import { SEEDED_READER, seedFreshDatabase } from './helpers/seed';

const authenticationFile = path.resolve('playwright/.authentication/user.json');

setup('authenticate', async ({ request }) => {
	// Reset to a known baseline first: this provisions the reader + admin
	// accounts, so login works even against a freshly migrated database with no
	// users (e.g. CI's empty ci.db). Only this setup resets users — specs use
	// resetShelfContent so they don't invalidate the stored browser session.
	await seedFreshDatabase(request);

	// Shelf's login is a SvelteKit form action, not a JSON API endpoint.
	// POST to `/login?/signInEmail` with form-encoded credentials.
	// Use the configured baseURL (preview host) so session cookies match the
	// host tests and fixtures use — localhost vs 127.0.0.1 are different cookie hosts.
	const response = await request.post('/login?/signInEmail', {
		form: { email: SEEDED_READER.email, password: SEEDED_READER.password }
	});

	expect(response.ok()).toBeTruthy();

	await request.storageState({ path: authenticationFile });
});
