import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

export default defineConfig({
	testDir: 'tests',
	//testIgnore: ['**/labs/fixtures/**', '**/labs/broken-traces/**'],
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: true
	},
	use: {
		//baseURL: 'http://127.0.0.1:4173',
		baseURL: 'http://localhost:5173',
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
			testMatch: /labs\/admin\.setup\.ts/
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
