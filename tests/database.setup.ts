import { test as setup } from '@playwright/test';
import { users, books, shelfEntries } from './data';
import { createUser, deleteAllUsers } from '../src/lib/server/users';
import { createBook, deleteAllBooks } from '../src/lib/server/books';
import { createShelfEntry, deleteAllShelfEntries } from '../src/lib/server/shelf-entries';

setup('seed starter data', async () => {
	await deleteAllShelfEntries();
	await deleteAllBooks();
	await deleteAllUsers();

	const createdUsers = new Map<string, { id: string }>();
	for (const record of users) {
		const created = await createUser(record);
		createdUsers.set(record.email, created);
	}

	const createdBooks = new Map<string, { id: string }>();
	for (const record of books) {
		const created = await createBook(record);
		createdBooks.set(record.openLibraryId, created);
	}

	for (const record of shelfEntries) {
		const user = createdUsers.get(record.userEmail);
		const book = createdBooks.get(record.bookOpenLibraryId);

		if (!user || !book) {
			throw new Error('Seed fixture references a missing user or book');
		}

		await createShelfEntry({
			userId: user.id,
			bookId: book.id,
			status: record.status as 'reading' | 'to-read' | 'finished',
			rating: record.rating
		});
	}
});
