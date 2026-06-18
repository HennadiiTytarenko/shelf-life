import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { APIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { book, shelfEntry, user } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

/**
 * Dev-only seeding endpoint. Guarded by `ENABLE_TEST_SEED=true` so it cannot
 * run in production. Wipes shelf entries and books, reseeds a known baseline,
 * and ensures the reader/admin accounts exist so the Playwright storage-state
 * setup can sign in deterministically.
 */

type SeedRequestBody = {
	/**
	 * When `true`, wipe + reseed users (and their sessions). Only the authentication
	 * setup project should send this — individual specs should reseed shelf content
	 * only so they don't invalidate the stored browser session.
	 */
	resetUsers?: boolean;
	readerEmail?: string;
	readerPassword?: string;
	readerName?: string;
	adminEmail?: string;
	adminPassword?: string;
	adminName?: string;
};

type SeededUser = {
	id: string;
	email: string;
};

const SEEDED_BOOKS: Array<typeof book.$inferInsert> = [
	{
		openLibraryId: 'OL1W',
		title: 'Station Eleven',
		author: 'Emily St. John Mandel',
		description: 'A literary post-collapse novel about a traveling Shakespeare troupe.'
	},
	{
		openLibraryId: 'OL2W',
		title: 'Piranesi',
		author: 'Susanna Clarke',
		description: 'A compact, beautifully strange novel about a house of infinite halls.'
	},
	{
		openLibraryId: 'OL3W',
		title: 'Annihilation',
		author: 'Jeff VanderMeer',
		description: 'A biologist enters Area X and tries to stay sane.'
	}
];

const isTestSeedEnabled = () => env.ENABLE_TEST_SEED === 'true';

const readRequestBody = async (request: Request): Promise<SeedRequestBody> => {
	try {
		const parsed: unknown = await request.json();
		if (parsed && typeof parsed === 'object') {
			return parsed as SeedRequestBody;
		}
	} catch {
		// empty body is fine — use defaults below
	}
	return {};
};

const ensureUser = async (
	email: string,
	password: string,
	name: string,
	resetUsers: boolean
): Promise<SeededUser> => {
	const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1);

	if (existing && !resetUsers) {
		return { id: existing.id, email: existing.email };
	}

	if (existing && resetUsers) {
		await db.delete(user).where(eq(user.id, existing.id));
	}

	try {
		await auth.api.signUpEmail({ body: { email, password, name } });
	} catch (signUpError) {
		if (!(signUpError instanceof APIError)) {
			throw signUpError;
		}
		throw new Error(`signUpEmail failed for ${email}: ${signUpError.message}`, {
			cause: signUpError
		});
	}

	const [created] = await db.select().from(user).where(eq(user.email, email)).limit(1);
	if (!created) {
		throw new Error(`Failed to provision user ${email}`);
	}
	return { id: created.id, email: created.email };
};

export const POST: RequestHandler = async ({ request }) => {
	if (!isTestSeedEnabled()) {
		error(404, 'Not Found');
	}

	const body = await readRequestBody(request);
	const resetUsers = body.resetUsers === true;

	await db.delete(shelfEntry);
	await db.delete(book);

	const insertedBooks = await db.insert(book).values(SEEDED_BOOKS).returning();

	const reader = await ensureUser(
		body.readerEmail ?? 'alice@example.com',
		body.readerPassword ?? 'ShelfStarter123!',
		body.readerName ?? 'Alice Reader',
		resetUsers
	);

	const admin = await ensureUser(
		body.adminEmail ?? 'admin@example.com',
		body.adminPassword ?? 'ShelfStarter123!',
		body.adminName ?? 'Admin Reader',
		resetUsers
	);

	const [stationEleven, piranesi] = insertedBooks;
	if (!stationEleven || !piranesi) {
		throw new Error('Expected at least two seeded books');
	}

	await db.insert(shelfEntry).values([
		{
			userId: reader.id,
			bookId: stationEleven.id,
			status: 'reading',
			rating: null
		},
		{
			userId: reader.id,
			bookId: piranesi.id,
			status: 'to-read',
			rating: null
		}
	]);

	return json({
		reader,
		admin,
		books: insertedBooks.map(({ id, openLibraryId, title }) => ({ id, openLibraryId, title }))
	});
};
