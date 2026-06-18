import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import users from '../data/users.json' with { type: 'json' };

const adminStorageStatePath = path.resolve('playwright/.authentication/admin.json');

setup('authenticate the seeded admin', async ({ request }) => {
	const admin = users.find((u) => u.isAdmin) ?? users[1];
	if (!admin) {
		throw new Error('tests/data/users.json must include an admin user');
	}

	// Same SvelteKit form action as tests/authentication.setup.ts — avoids flaky
	// UI submission and matches how reader storage state is created.
	const response = await request.post('/login?/signInEmail', {
		form: { email: admin.email, password: admin.password }
	});

	expect(response.ok()).toBeTruthy();
	await request.storageState({ path: adminStorageStatePath });
});
