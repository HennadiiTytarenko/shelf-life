import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/smoke',
	testMatch: /post-deploy\.spec\.ts/,
	fullyParallel: true,
	workers: 1,
	reporter: [['html', { open: 'never', outputFolder: 'playwright-report/smoke-html' }], ['list']],
	use: {
		baseURL: process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4173',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
