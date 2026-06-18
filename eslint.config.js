import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		// Global Playwright and SvelteKit anti-pattern guards.
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector:
						"CallExpression[callee.property.name='waitForLoadState'] > Literal[value='networkidle']",
					message: 'networkidle is unreliable. Wait on a real signal.'
				},
				{
					selector:
						"MemberExpression[object.type='MemberExpression'][object.property.name='body'][property.name='userId']",
					message: 'Read userId from the session, not the request body. See CLAUDE.md → Auth.'
				}
			]
		}
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector: "CallExpression[callee.property.name='waitForTimeout']",
					message: 'page.waitForTimeout is banned. See CLAUDE.md → Playwright → Waiting.'
				},
				{
					selector: "CallExpression[callee.property.name='locator'][arguments.0.type='Literal']",
					message: 'Use a getByRole/getByLabel locator. See CLAUDE.md → Playwright → Locators.'
				},
				{
					selector:
						"CallExpression[callee.property.name='waitForLoadState'] > Literal[value='networkidle']",
					message: 'networkidle is unreliable. Wait on a real signal.'
				}
			]
		}
	},
	{
		files: ['tests/end-to-end/**/*.ts'],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector: "CallExpression[callee.property.name='waitForTimeout']",
					message: 'page.waitForTimeout is banned. See CLAUDE.md → Playwright → Waiting.'
				},
				{
					selector: "CallExpression[callee.property.name='locator'][arguments.0.type='Literal']",
					message: 'Use a getByRole/getByLabel locator. See CLAUDE.md → Playwright → Locators.'
				},
				{
					selector:
						"CallExpression[callee.property.name='waitForLoadState'] > Literal[value='networkidle']",
					message: 'networkidle is unreliable. Wait on a real signal.'
				}
			]
		}
	}
);
