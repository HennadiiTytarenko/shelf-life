import books from './books.json' with { type: 'json' };
import shelfEntries from './shelf-entries.json' with { type: 'json' };
import users from './users.json' with { type: 'json' };

const [reader, admin] = users;

if (!reader || !admin) {
	throw new Error('Expected tests/data/users.json to include the reader and admin users');
}

export { users, books, shelfEntries, reader, admin };
