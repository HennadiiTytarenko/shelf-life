import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

// The preview server (see webServer.command) listens here. baseURL must match it:
// pointing elsewhere sends requests where nothing is served (and `localhost`
// resolves to IPv6 ::1 → ECONNREFUSED), and session cookies are host-scoped.
const baseURL = 'http://127.0.0.1:4173';

export default defineConfig({
	testDir: 'tests',
	//testIgnore: ['**/labs/fixtures/**', '**/labs/broken-traces/**'],
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
		url: baseURL,
		reuseExistingServer: true
	},
	use: {
		baseURL,
		// SvelteKit rejects cross-origin form-action POSTs (CSRF). The
		// APIRequestContext sends no Origin header by default, so form-action
		// logins (tests/authentication.setup.ts, labs/admin.setup.ts) return 403.
		// Send an Origin matching the server so those POSTs are accepted.
		extraHTTPHeaders: { Origin: baseURL },
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},
	expect: {
		toHaveScreenshot: {
			animations: 'disabled',
			caret: 'hide',
			scale: 'css',
			maxDiffPixelRatio: 0.01
		}
	},
	reporter: [
		['html', { open: 'never', outputFolder: 'playwright-report/html' }],
		['json', { outputFile: 'playwright-report/report.json' }],
		['list']
	],
	projects: [
		/*
		{
			name: 'db-setup',
			testMatch: /database\.setup\.ts/
		},*/
		/*
    {
      name: 'public-shelf',
      testMatch: /(smoke|public-shelf)\.spec\.ts/,
      dependencies: ['setup'],
    },
	    {
      name: 'setup',
      testMatch: /database\.setup\.ts/,
    },

	
	*/
		{
			name: 'setup',
			testMatch: /authentication\.setup\.ts/
		},
		{
			name: 'admin-setup',
			// Depends on `setup`: that project seeds the database (resetting users),
			// which provisions the admin account this login relies on. Running it
			// first also avoids racing the user reset against this login.
			testMatch: /labs\/admin\.setup\.ts/,
			dependencies: ['setup']
		},
		{
			name: 'public-shelf',
			testMatch: /(smoke|public-shelf)\.spec\.ts/
			//dependencies: ['setup'],
		},
		{
			name: 'chromium',
			use: {
				storageState: path.resolve('playwright/.authentication/user.json')
			},
			dependencies: [
				'setup',
				'admin-setup'
				/*'db-setup'*/
			]
		},
		{
			name: 'authenticated',
			testMatch: /(rate-book|accessibility|visual-authenticated|performance)\.spec\.ts/,
			use: {
				...devices.DesktopChrome,
				storageState: path.resolve('playwright/.authentication/user.json')
			},
			dependencies: ['setup']
		}
	]
});
