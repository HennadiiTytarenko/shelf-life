import fs from 'node:fs';

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';

if (!/(^|\s)--no-verify(\s|$)/.test(command)) {
	process.exit(0);
}

process.stdout.write(
	JSON.stringify({
		hookSpecificOutput: {
			hookEventName: 'PreToolUse',
			permissionDecision: 'deny',
			permissionDecisionReason:
				'Never bypass Git hooks with --no-verify. Fix the failing hook instead.'
		}
	})
);

process.exit(0);
