import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class StepReporter implements Reporter {
	onTestEnd(test: TestCase, result: TestResult) {
		if (result.status !== 'failed') return;
		process.stderr.write(`\n[${test.title}]\n`);
		for (const step of result.steps) {
			process.stderr.write(`  - ${step.title} (${step.duration}ms)\n`);
		}
	}
}

export default StepReporter;
