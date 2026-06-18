import { expect, test } from '@playwright/test';
import { resetShelfContent } from './helpers/seed';

test('seed', async ({ page, request }) => {
	await resetShelfContent(request);
	await page.goto('/shelf');
	await expect(page.getByRole('heading', { name: "Alice Reader's shelf" })).toBeVisible();
});
