import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const expectNoViolations = async (page: Page): Promise<void> => {
	const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
	expect(results.violations).toEqual([]);
};

test('home page has no automated accessibility violations', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expectNoViolations(page);
});

test('login page has no automated accessibility violations', async ({ page }) => {
	await page.goto('/login');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expectNoViolations(page);
});

test('design-system page has no automated accessibility violations', async ({ page }) => {
	await page.goto('/design-system');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expectNoViolations(page);
});
