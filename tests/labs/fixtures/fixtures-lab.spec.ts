import { test, expect } from './fixtures';

test.skip(
	process.env.PLAYWRIGHT_INCLUDE_LABS == '1',
	'Lab scaffold disabled by default. Set PLAYWRIGHT_INCLUDE_LABS=1 to run labs.'
);

/**
 * Green-by-default spec for the fixtures refactor lab.
 *
 * This file exercises every fixture in `fixtures.ts` and passes as
 * committed. As you refactor `fixtures.ts` (renaming, adding teardowns,
 * demoting helpers), update *this* spec to match. The refactor is not done
 * until this spec still passes against your changes.
 *
 * Do not change what each test is checking — only how it asks for the
 * setup. That discipline is what keeps the exercise about fixture design
 * rather than test rewriting.
 */

test.describe('fixtures lab — starting state', () => {
	test('seeded reader identity is available to tests', async ({ seededReader }) => {
		expect(seededReader.email).toBe('alice@example.com');
	});

	test('empty-shelf fixture leaves the server in a baseline state', async ({ seededShelf }) => {
		const response = await seededShelf.get('/api/shelf');
		expect(response.ok()).toBeTruthy();
		const body = (await response.json()) as { entries: unknown[] };
		expect(Array.isArray(body.entries)).toBe(true);
	});

	test('shelf-with-books fixture returns seeded shelf entries', async ({ seededShelf }) => {
		const response = await seededShelf.get('/api/shelf');
		expect(response.ok()).toBeTruthy();
		const body = (await response.json()) as { entries: Array<{ book: { title: string } }> };
		const titles = body.entries.map((entry) => entry.book.title);
		expect(titles).toEqual(expect.arrayContaining(['Station Eleven', 'Piranesi']));
	});

	test('authed page lands on the shelf', async ({ page }) => {
		await expect(page).toHaveURL(/\/shelf/);
	});

	/*
	test('logged-out page is redirected to login when it asks for /shelf', async ({
		loggedOutPage
	}) => {
		await loggedOutPage.goto('/shelf');
		await expect(loggedOutPage).toHaveURL(/\/login/);
	});
});*/

	test('admin curates, reader sees', async ({ page, adminRequest }) => {
		await adminRequest.post('/api/admin/featured-books', {
			data: { openLibraryId: 'OL1W', position: 2 }
		});

		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: /A few books worth keeping close/i })
		).toBeVisible();
		await expect(page.getByRole('article', { name: /Station Eleven/ })).toBeVisible();
	});

	test('promoted book appears on the reader home page', async ({ page, adminRequest }) => {
		const response = await adminRequest.post('/api/admin/featured-books', {
			data: { openLibraryId: 'OL1W', position: 1 }
		});
		expect(response.ok()).toBe(true);

		await page.goto('/');
		await expect(page.getByRole('article', { name: /Station Eleven/ })).toBeVisible();
	});
});
