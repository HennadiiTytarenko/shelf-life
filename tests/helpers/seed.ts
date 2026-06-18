import type { APIRequestContext } from '@playwright/test';

/**
 * Known reader account used by every authenticated end-to-end test. Kept in
 * sync with the `/api/testing/seed` defaults so individual specs never need
 * to invent their own fixture users.
 */
export const SEEDED_READER = {
	email: 'alice@example.com',
	password: 'ShelfStarter123!',
	name: 'Alice Reader'
} as const;

export type SeededBookSummary = {
	id: string;
	openLibraryId: string;
	title: string;
};

export type SeedResult = {
	reader: { id: string; email: string };
	admin: { id: string; email: string };
	books: SeededBookSummary[];
};

const postSeed = async (
	request: APIRequestContext,
	body: Record<string, unknown>
): Promise<SeedResult> => {
	const response = await request.post('/api/testing/seed', { data: body });
	if (!response.ok()) {
		throw new Error(
			`Seeding failed: ${response.status()} ${await response.text().catch(() => '')}`
		);
	}
	return (await response.json()) as SeedResult;
};

/**
 * Fully reset the database, including user accounts and sessions. Only the
 * authentication setup project should call this — individual specs should use
 * `resetShelfContent` so the stored browser session stays valid.
 */
export const seedFreshDatabase = (request: APIRequestContext): Promise<SeedResult> =>
	postSeed(request, { resetUsers: true });

/**
 * Reset book and shelf content to the baseline fixtures without touching user
 * accounts or sessions. Safe to call from specs that run inside the
 * `authenticated` project (it leaves the storage-state cookie valid).
 */
export const resetShelfContent = (request: APIRequestContext): Promise<SeedResult> =>
	postSeed(request, {});
