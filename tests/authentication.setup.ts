import { test as setup, expect } from '@playwright/test';
import path from 'node:path';

const authenticationFile = path.resolve('playwright/.authentication/user.json');

setup('authenticate', async ({ request }) => {
	// Shelf's login is a SvelteKit form action, not a JSON API endpoint.
	// POST to `/login?/signInEmail` with form-encoded credentials.
	// Use the configured baseURL (preview host) so session cookies match the
	// host tests and fixtures use — localhost vs 127.0.0.1 are different cookie hosts.
	const response = await request.post('/login?/signInEmail', {
		form: { email: 'alice@example.com', password: 'ShelfStarter123!' }
	});

	expect(response.ok()).toBeTruthy();

	await request.storageState({ path: authenticationFile });
});
