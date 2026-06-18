import { describe, expect, it } from 'vitest';
import { formatFinishedThisYearLabel } from './reading-stats';

describe('formatFinishedThisYearLabel', () => {
	it('uses the singular form when exactly one book has been finished', () => {
		expect(formatFinishedThisYearLabel(1)).toBe('1 book');
	});

	it('uses the plural form for zero or more than one finished book', () => {
		expect(formatFinishedThisYearLabel(0)).toBe('0 books');
		expect(formatFinishedThisYearLabel(2)).toBe('2 books');
		expect(formatFinishedThisYearLabel(42)).toBe('42 books');
	});
});
