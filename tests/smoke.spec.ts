import { expect, test } from '@playwright/test';
test(
	'home page introduces Shelf and exposes the public starter navigation',
	{ tag: ['@critical'] },
	async ({ page }) => {
		await test.step('open the home page', async () => {
			await page.goto('/');
		});

		await test.step('verify the hero message and primary navigation', async () => {
			await expect(
				page.getByRole('heading', { name: /Build a shelf that remembers what you actually read/i })
			).toBeVisible();

			const primaryNavigation = page.getByRole('navigation', { name: 'Primary' });

			await expect
				.soft(primaryNavigation.getByRole('link', { name: 'Search' }))
				.toHaveAttribute('href', '/search');
			await expect
				.soft(primaryNavigation.getByRole('link', { name: 'Design system' }))
				.toHaveAttribute('href', '/design-system');
			await expect
				.soft(primaryNavigation.getByRole('link', { name: 'Playground' }))
				.toHaveAttribute('href', '/playground');
			await expect
				.soft(page.getByRole('banner').getByRole('link', { name: 'Sign in' }))
				.toHaveAttribute('href', '/login');
		});
	}
);
