import { expect, test } from '@playwright/test';
import { resetShelfContent } from './helpers/seed';

test.beforeEach(async ({ request }) => {
    await resetShelfContent(request);
});

test('shelf page matches the seeded visual baseline', async ({ page }) => {
	await page.goto('/shelf');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByRole('article', { name: /Station Eleven/ })).toBeVisible();
	await expect(page).toHaveScreenshot('shelf-page.png', { fullPage: true });
});
