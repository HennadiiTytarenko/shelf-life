import { expect, test } from '@playwright/test';
//import path from 'node:path';

test('home page introduces Shelf and exposes the public starter navigation', async ({ page }) => {
	await page.goto('/playground');
});

//Locate the “Add to shelf” button.
test('Locate the “Add to shelf” button.', async ({ page }) => {
	await page.goto('/playground');
	await expect(page.getByRole('button', { name: 'Add to shelf' })).toBeVisible();
});

//Locate the “Cancel” button.
test('Locate the “Cancel” button.', async ({ page }) => {
	await page.goto('/playground');
	await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
});

//Locate the disabled “Out of stock” button and assert that it is disabled.
test('Locate the disabled “Out of stock” button and assert that it is disabled.', async ({
	page
}) => {
	await page.goto('/playground');
	await expect(page.getByRole('button', { name: 'Out of stock' })).toBeDisabled();
});

//Locate the search input by its label.
test('Locate the search input by its label.', async ({ page }) => {
	await page.goto('/playground');
	await expect(page.getByLabel('Search')).toBeVisible();
});

//Challenge 5. There are two “Delete” buttons on the page. Locate the first one. (Hint: .first() or .nth(0) on a locator.)
test('There are two “Delete” buttons on the page. Locate the first one.', async ({ page }) => {
	await page.goto('/playground');
	await expect(page.getByRole('button', { name: 'Delete' }).first()).toBeVisible();
});

//Challenge 6. Locate the “Remove” button inside the third item in the “Reading list.” You’ll need to chain: find the list, find the items, narrow to the third, then find the button inside it.
test('Locate the “Remove” button inside the third item in the “Reading list.”', async ({
	page
}) => {
	await page.goto('/playground');
	const list = page.getByRole('list', { name: 'Reading list' });
	const items = list.getByRole('listitem');
	const thirdItem = items.nth(2);
	const removeButton = thirdItem.getByRole('button', { name: 'Remove' });
	await expect(removeButton).toBeVisible();
});

//Challenge 7. Inside the article labeled “Piranesi by Susanna Clarke,” locate the “Rate this book” button.
test('Inside the article labeled “Piranesi by Susanna Clarke,” locate the “Rate this book” button.', async ({
	page
}) => {
	await page.goto('/playground');
	const article = page.getByRole('article', { name: 'Piranesi by Susanna Clarke' });
	const rateButton = article.getByRole('button', { name: 'Rate this book' });
	await expect(rateButton).toBeVisible();
});

//Challenge 8. Locate the “Author” input and assert that its hint text (“Last name, first name”) is visible.
test('Locate the “Author” input and assert that its hint text (“Last name, first name”) is visible.', async ({
	page
}) => {
	await page.goto('/playground');
	const authorInput = page.getByLabel('Author');
	await expect(authorInput).toHaveAccessibleDescription('Last name, first name');
});

//Challenge 9. Find the paragraph that mentions “42 days.”
test('Find the paragraph that mentions “42 days.”', async ({ page }) => {
	await page.goto('/playground');
	const paragraph = page.getByText('42 days.');
	await expect(paragraph).toBeVisible();
});

//Challenge 10. Find the text “3 of 12 books finished.”
test('Find the text “3 of 12 books finished.”', async ({ page }) => {
	await page.goto('/playground');
	const text = page.getByText('3 of 12 books finished');
	await expect(text).toBeVisible();
});

//Challenge 11. Two paragraphs on the page contain the word “shelf.”
// Find the one that says “You have 4 books on your shelf right now”—without matching the other one.
// (Hint: { exact: true } won’t help here since neither is an exact match for “shelf.”
// Use a regex or a longer string.)
test('Two paragraphs on the page contain the word “shelf.” Find the one that says “You have 4 books on your shelf right now”—without matching the other one.', async ({
	page
}) => {
	await page.goto('/playground');
	const text = page.getByText('You have 4 books on your shelf right now');
	await expect(text).toBeVisible();
});

//Challenge 12. Count the data rows in the “Book ratings” table (not including the header row).
// Assert there are exactly 3.
test('Count the data rows in the “Book ratings” table (not including the header row). Assert there are exactly 3.', async ({
	page
}) => {
	await page.goto('/playground');
	const table = page.getByRole('table', { name: 'Book ratings' });
	const rows = table.getByRole('row');
	//.filter({ hasNot: page.getByRole('columnheader') });
	await expect(rows).toHaveCount(3);
});

//Challenge 13. Locate the “Reading list” and assert it has exactly 4 items.
test('Locate the “Reading list” and assert it has exactly 4 items.', async ({ page }) => {
	await page.goto('/playground');
	const list = page.getByRole('list', { name: 'Reading list' });
	const items = list.getByRole('listitem');
	await expect(items).toHaveCount(4);
});

//Challenge 14.
//Click “Show details” and assert that the detail paragraph about Station Eleven appears.
test('Click “Show details” and assert that the detail paragraph about Station Eleven appears.', async ({
	page
}) => {
	await page.goto('/playground');
	await page.getByRole('button', { name: 'Show details' }).click();
	const paragraph = page.getByText(
		'Station Eleven is a post-apocalyptic novel by Emily St. John Mandel, published in 2014.'
	);
	await expect(paragraph).toBeVisible();
});

//Challenge 15. Click “Load more” and wait for the two new list items to appear.
// Assert the list “Newly loaded books” has 2 items.
test('Click “Load more” and wait for the two new list items to appear. Assert the list “Newly loaded books” has 2 items.', async ({
	page
}) => {
	await page.goto('/playground');
	await page.getByRole('button', { name: 'Load more' }).click();
	await expect(
		page.getByRole('list', { name: 'Newly loaded books' }).getByRole('listitem')
	).toHaveCount(2);
});

//Challenge 16. Assert that “Loading…” is visible, then wait for it to disappear and “Content loaded” to appear.
// (The page has a 1-second delay built in—your assertions need to handle it.)
test('Assert that “Loading…” is visible, then wait for it to disappear and “Content loaded” to appear.', async ({
	page
}) => {
	await page.goto('/playground');
	await page.getByRole('button', { name: 'Load more' }).click();
	await expect(page.getByRole('button', { name: 'Loading...' })).toBeVisible();
	await expect(page.getByText('Content loaded')).toBeVisible();
});

//Challenge 17. Click the “Rate this book” button in the Dialogs section and assert that a dialog appears.
test('Click the “Rate this book” button in the Dialogs section and assert that a dialog appears.', async ({
	page
}) => {
	await page.goto('/playground');
	await page.getByRole('button', { name: 'Rate this book' }).last().click();
	await expect(page.getByRole('dialog', { name: 'Rate Station Eleven' })).toBeVisible();
});

//Challenge 18. Inside the dialog, select 4 stars and click “Save rating.”
test('Inside the dialog, select 4 stars and click “Save rating.”', async ({ page }) => {
	await page.goto('/playground');
	await page.getByRole('button', { name: 'Rate this book' }).last().click();
	await page.getByLabel('4 stars').check();
	await page.getByRole('button', { name: 'Save rating' }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
});

//Challenge 19. Open the dialog again and close it with the “Cancel” button. Assert the dialog is no longer visible.
test('Open the dialog again and close it with the “Cancel” button. Assert the dialog is no longer visible.', async ({
	page
}) => {
	await page.goto('/playground');
	await page.getByRole('button', { name: 'Rate this book' }).last().click();
	await page.getByLabel('Rate Station Eleven').getByRole('button', { name: 'Cancel' }).click();
	await expect(page.getByRole('dialog', { name: 'Rate Station Eleven' })).not.toBeVisible();
});

//Challenge 20. Locate the alert that says “Unsaved changes will be lost.”
test('Locate the alert that says “Unsaved changes will be lost.”', async ({ page }) => {
	await page.goto('/playground');
	const alert = page.getByRole('alert').filter({ hasText: 'Unsaved changes will be lost' });
	await expect(alert).toBeVisible();
});

//Challenge 21. Locate the progress bar and assert its aria-valuenow is 65.
test('Locate the progress bar and assert its aria-valuenow is 65.', async ({ page }) => {
	await page.goto('/playground');
	const progressBar = page.getByRole('progressbar', { name: 'Reading progress' });
	await expect(progressBar).toHaveAttribute('aria-valuenow', '65');
});

//Challenge 22. Locate the “Toggle panel” button. Assert that it has aria-expanded set to false. Click it.
// Assert that aria-expanded is now true and the panel content is visible.
test('Locate the “Toggle panel” button. Assert that it has aria-expanded set to false. Click it. Assert that aria-expanded is now true and the panel content is visible.', async ({
	page
}) => {
	await page.goto('/playground');
	const toggleButton = page.getByRole('button', { name: 'Toggle panel' });
	await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
	await toggleButton.click();
	await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
	await expect(
		page.getByText(
			'This panel is controlled by the toggle button above. It uses aria-expanded and aria-controls to communicate its state.'
		)
	).toBeVisible();
});

//Challenge 23. Try to locate the clickable <div> by role (getByRole('button')).
//It won’t work—the div has no role. Locate it by its data-testid instead (fake-button).
// This is the teaching moment: if you can’t find it by role, the markup is broken.
// This won't work — the div has no role:
// await page.getByRole('button', { name: /Click me/ }).click();

// Use the test ID fallback:
//await page.getByTestId('fake-button').click();

//Challenge 24. Locate the icon-only button using data-testid (icon-only-button).
// This button has no accessible name—getByRole('button', { name: ... }) can’t target it.
// A real codebase should fix the button. A test suite should use getByTestId until it’s fixed.

//await expect(page.getByTestId('icon-only-button')).toBeVisible();

//Challenge 25. Start from a deliberately broad locator like page.getByRole('article'),
// then use filter({ hasText: 'Piranesi' }) or filter({ has: ... }) to narrow it to the one card you actually want.
// Click “Rate this book” inside that filtered card.
test('Start from a deliberately broad locator', async ({ page }) => {
	await page.goto('/playground');
	await page
		.getByRole('article')
		.filter({ hasText: 'Piranesi' })
		.getByRole('button', { name: 'Rate this book' })
		.click();
	await expect(page.getByRole('dialog', { name: 'Rate Piranesi' })).toBeVisible();
});

//Challenge 26. Write one test that waits for either the “Compose” button or a security dialog to appear by using locator.or(...).first().
// If the dialog wins, dismiss it and continue.
test('Write one test that waits for either the “Compose” button or a security dialog to appear by using locator.or(...).first(). If the dialog wins, dismiss it and continue.', async ({
	page
}) => {
	await page.goto('/playground');
	await page.getByRole('button', { name: 'Compose' }).or(page.getByRole('dialog')).first().click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Cancel' }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
});

test('search for books', async ({ page }) => {
	await page.routeFromHAR('tests/fixtures/open-library-search.har', {
		url: '**/openlibrary.org/search.json*',
		update: true // <-- record mode
	});
	page.on('request', (request) => console.log('>>', request.method(), request.url()));
	page.on('response', (response) => console.log('<<', response.status(), response.url()));
	await page.goto('/search');
	await page.getByLabel('Search').fill('Station Eleven');
	await page.getByRole('button', { name: 'Search' }).click();
	await expect(page.getByText('Station Eleven')).toBeVisible();
});

//const STATION_ELEVEN_HAR = path.resolve('tests/fixtures/open-library-station-eleven.har');

test('search returns Open Library results from the replayed HAR', async ({ page }) => {
	await page.routeFromHAR('tests/fixtures/open-library-search.har', {
		url: '**/openlibrary.org/**',
		update: true
		//notFound: 'abort'
	});

	await page.goto('/search?query=station+eleven');

	const stationEleven = page.getByRole('article', { name: /Station Eleven/ }).first();
	await expect(stationEleven).toBeVisible();
	await expect(stationEleven.getByText(/Emily St\. John Mandel/)).toBeVisible();
});
