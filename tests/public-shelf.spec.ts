import { expect, test } from '@playwright/test';

test('public shelf shows the seeded reader shelf', async ({ page }) => {
	await page.goto('/shelf/alice');

	await expect(page.getByRole('heading', { name: /Alice Reader's shelf/i })).toBeVisible();
	await expect(page.getByText('Station Eleven')).toBeVisible();
	await expect(page.getByText('Piranesi')).toBeVisible();
});
