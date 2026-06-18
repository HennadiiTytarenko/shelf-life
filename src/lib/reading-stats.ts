export const formatFinishedThisYearLabel = (finishedBooks: number): string =>
	`${finishedBooks} ${finishedBooks === 1 ? 'book' : 'books'}`;
