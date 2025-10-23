import type { ActionStepDefinitionDict, Locator, Step } from "./types";
import { defaultActions } from "./action";
import { defaultGivens } from "./given";
import { getA11ySnapshot } from "./getA11ySnapshot";
import { defaultAssertions } from "./assert";

export async function runSiheom(
	...steps: Step<typeof defaultActions, typeof defaultAssertions>[]
) {
	const logs: string[] = [];

	const handleError = (error: Error) => {
		const index = error.message.indexOf("Ignored node");
		const message = `[Logs]\n\n${logs.join("\n")}\n\n[Original Error Message]\n\n${error.message.slice(0, index === -1 ? undefined : index)}\n\n[A11y Snapshot]\n\n${getA11ySnapshot(document.body)}`;
		throw new Error(message);
	};

	for (const step of steps) {
		if ("action" in step) {
			const run = defaultActions[
				step.action
			] as ActionStepDefinitionDict[string];
			logs.push(step.log);
			await run(step.target, ...(step.args ?? [])).catch(handleError);
		} else if ("given" in step) {
			const run = defaultGivens[step.given] as (
				...args: readonly unknown[]
			) => Promise<void>;
			logs.push(step.log);
			await run(...(step.args ?? [])).catch(handleError);
		} else if ("assert" in step) {
			const run = defaultAssertions[step.assert] as (
				locator: Locator,
				...args: readonly unknown[]
			) => Promise<void>;
			logs.push(step.log);
			await run(step.target, ...(step.args ?? [])).catch(handleError);
		} else {
			throw new Error("Invalid step");
		}
	}
}
