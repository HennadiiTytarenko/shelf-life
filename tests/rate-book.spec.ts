import { expect, test } from '@playwright/test';
import { resetShelfContent } from './helpers/seed';

test.describe('rate a book on your shelf', () => {
  test.beforeEach(async ({ request }) => {
    await resetShelfContent(request);
  });

  test('user can rate Station Eleven', { tag: ['@critical'] }, async ({ page, request }) => {
	test.info().annotations.push({
		type: 'issue',
		description: 'https://github.com/stevekinney/shelf-life/issues/TBD',
	  });
    await test.step('open the shelf page', async () => {
      await page.goto('/shelf');
    });

    const stationEleven = page.getByRole('article', { name: /Station Eleven/ });
	const dialog = page.getByRole('dialog', { name: /Rate Station Eleven/ });


    await test.step('open the rate-book dialog for Station Eleven', async () => {
      await expect(stationEleven).toBeVisible();
      await stationEleven.getByRole('button', { name: 'Rate this book' }).click();
	  await expect(dialog).toBeVisible();

    });

    await test.step('submit 4 stars', async () => {


      await dialog.getByRole('radio', { name: '4 stars' }).check();

      // The `/api/shelf/*` PATCH endpoint is built out in the rate-book
      // hardening lab; the current Shelf starter intentionally does not ship
      // persisted-rating routes. Treat this block as future-state until
      // that lab has landed.
      const ratingResponse = page.waitForResponse(
        (response) =>
          /\/api\/shelf\/.+/.test(response.url()) && response.request().method() === 'PATCH',
      );
      await dialog.getByRole('button', { name: 'Save rating' }).click();
      const savedResponse = await ratingResponse;
      expect(savedResponse.ok()).toBe(true);
    });

    await test.step('verify the rating persists on the shelf and via API', async () => {
      await expect(page.getByRole('status')).toHaveText(/Thanks/);
      await expect(stationEleven.getByText('Rated: 4/5')).toBeVisible();

      const shelfResponse = await request.get('/api/shelf');
      expect(shelfResponse.ok()).toBe(true);
      const body = (await shelfResponse.json()) as {
        entries: Array<{ book: { title: string }; rating: number | null }>;
      };
      const entry = body.entries.find((e) => e.book.title === 'Station Eleven');
      expect(entry?.rating).toBe(4);
    });
  });
});