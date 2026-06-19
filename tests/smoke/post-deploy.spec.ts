// tests/smoke/post-deploy.spec.ts
import { expect, test } from '@playwright/test';

const smokeBaseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4173';

test.use({ baseURL: smokeBaseUrl });

test('home page renders and exposes sign in', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByRole('banner').getByRole('link', { name: 'Sign in' })).toBeVisible();
});
