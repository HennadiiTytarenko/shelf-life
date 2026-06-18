type EnvironmentVariables = Record<string, string | undefined>;

type EnvironmentConfiguration = {
	databaseUrl: string;
	openLibraryBaseUrl: string;
};

try {
	process.loadEnvFile?.();
} catch {
	// .env is optional; defaults are applied below
}

export const DEFAULT_DATABASE_URL = 'file:./local.db';
export const DEFAULT_OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

const readEnvironmentString = (value: string | undefined): string | undefined => {
	const trimmedValue = value?.trim();
	return trimmedValue ? trimmedValue : undefined;
};

/**
 * Resolves the environment-backed settings Shelf needs at runtime, applying
 * course-friendly local defaults whenever `.env` is missing or incomplete.
 */
export const getEnvironmentVariables = (
	environmentVariables: EnvironmentVariables
): EnvironmentConfiguration => {
	return {
		databaseUrl: readEnvironmentString(environmentVariables.DATABASE_URL) ?? DEFAULT_DATABASE_URL,
		openLibraryBaseUrl:
			readEnvironmentString(environmentVariables.OPEN_LIBRARY_BASE_URL) ??
			DEFAULT_OPEN_LIBRARY_BASE_URL
	};
};
