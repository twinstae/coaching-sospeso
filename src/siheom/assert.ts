import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/dom";
import type { AssertionStepDefinitionDict, Locator } from "./types";
import { getElement, getElements, locatorLog } from "./query";
import { expect } from "vitest";
import { getA11ySnapshot } from "./getA11ySnapshot";
import { tableToMarkdown } from "./tableToMarkdown";

export const defaultAssertions = {
	visible: async (target: Locator, expected: boolean) => {
		await waitFor(async () => {
			const element = getElement(target, expected);

			if (expected) {
				expect(element).toBeInTheDocument();
				expect(element).not.toHaveAttribute("aria-hidden", "true");
			} else {
				expect(element).not.toBeInTheDocument();
				expect(element).not.toHaveAttribute("aria-hidden", "false");
			}
		});
	},
	checked: async (target: Locator, expected: boolean) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();

			if (element instanceof HTMLInputElement && element.type === "checkbox") {
				if (expected) {
					expect(element).toHaveAttribute("checked", "true");
				} else {
					expect(element).not.toHaveAttribute("checked", "true");
				}
			} else {
				if (expected) {
					expect(element).toHaveAttribute("aria-checked", "true");
				} else {
					expect(element).not.toHaveAttribute("aria-checked", "true");
				}
			}
		});
	},
	expanded: async (target: Locator, expected: boolean) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();

			expect(element).toHaveAttribute(
				"aria-expanded",
				expected ? "true" : "false",
			);
		});
	},
	selected: async (target: Locator, expected: boolean) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();

			expect(element).toHaveAttribute(
				"aria-selected",
				expected ? "true" : "false",
			);
		});
	},
	disabled: async (target: Locator, expected: boolean) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();

			if (element.hasAttribute("disabled")) {
				expect(element).toHaveAttribute(
					"disabled",
					expected ? "disabled" : null,
				);
			} else {
				expect(element).toHaveAttribute(
					"aria-disabled",
					expected ? "true" : "false",
				);
			}
		});
	},
	current: async (
		target: Locator,
		expected: "true" | "false" | "page" | "step" | "location" | "date" | "time",
		flag = true,
	) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();

			if (flag) {
				expect(element).toHaveAttribute("aria-current", expected);
			} else {
				expect(element).not.toHaveAttribute("aria-current", expected);
			}
		});
	},
	count: async (target: Locator, expected: number, flag = true) => {
		await waitFor(async () => {
			const elements = getElements(target, true);

			if (flag) {
				expect(elements).toHaveLength(expected);
			} else {
				expect(elements).not.toHaveLength(expected);
			}
		});
	},
	value: async (target: Locator, expected: string, flag = true) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();

			if (flag) {
				expect(element).toHaveValue(expected);
			} else {
				expect(element).not.toHaveValue(expected);
			}
		});
	},
	errormessage: async (target: Locator, expected: string, flag = true) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();

			if (flag) {
				expect(element).toHaveAccessibleErrorMessage(expected);
			} else {
				expect(element).not.toHaveAccessibleErrorMessage(expected);
			}
		});
	},
	a11ySnapshot: async (target: Locator, path: string) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();
		});

		await expect(getA11ySnapshot(getElement(target, true))).toMatchFileSnapshot(
			`__snapshots__/${path}`,
		);
	},
	tableSnapshot: async (target: Locator, path: string) => {
		await waitFor(async () => {
			const element = getElement(target, true);

			expect(element).toBeInTheDocument();
			expect(element).toBeInstanceOf(HTMLTableElement);
		});

		await expect(
			tableToMarkdown(getElement(target, true) as HTMLTableElement),
		).toMatchFileSnapshot(`__snapshots__/${path}`);
	},
} satisfies AssertionStepDefinitionDict;

export const assertions = {
	visible: (target: Locator) =>
		({
			assert: "visible",
			target,
			args: [true],
			log: `visible     : ${target.role} "${target.name}"`,
		}) as const,
	checked: (target: Locator) =>
		({
			assert: "checked",
			target,
			args: [true],
			log: `checked     : ${target.role} "${target.name}" is checked`,
		}) as const,
	expanded: (target: Locator) =>
		({
			assert: "expanded",
			target,
			args: [true],
			log: `expanded    : ${target.role} "${target.name}" is expanded`,
		}) as const,
	selected: (target: Locator) =>
		({
			assert: "selected",
			target,
			args: [true],
			log: `selected    : ${target.role} "${target.name}" is selected`,
		}) as const,
	disabled: (target: Locator) =>
		({
			assert: "disabled",
			target,
			args: [true],
			log: `disabled    : ${target.role} "${target.name}" is disabled`,
		}) as const,
	current: (
		target: Locator,
		expected: "true" | "false" | "page" | "step" | "location" | "date" | "time",
	) =>
		({
			assert: "current",
			target,
			args: [expected, true],
			log: `current     : ${target.role} "${target.name}" is ${expected}`,
		}) as const,
	count: (target: Locator, expected: number) =>
		({
			assert: "count",
			target,
			args: [expected, true],
			log: `count       : ${target.role} "${target.name}" has ${expected}`,
		}) as const,
	value: (target: Locator, expected: string) =>
		({
			assert: "value",
			target,
			args: [expected, true],
			log: `value       : ${target.role} "${target.name}" has value "${expected}"`,
		}) as const,
	errormessage: (target: Locator, expected: string) =>
		({
			assert: "errormessage",
			target,
			args: [expected, true],
			log: `${target.role} ${target.name}의 에러 메시지는 "${expected}" 이다.`,
		}),
	not: {
		visible: (target: Locator) =>
			({
				assert: "visible",
				target,
				args: [false],
				log: `not visible: ${target.role} "${target.name}"`,
			}) as const,
		checked: (target: Locator) =>
			({
				assert: "checked",
				target,
				args: [false],
			}) as const,
		expanded: (target: Locator) =>
			({
				assert: "expanded",
				target,
				args: [false],
			}) as const,
		selected: (target: Locator) =>
			({
				assert: "selected",
				target,
				args: [false],
			}) as const,
		disabled: (target: Locator) =>
			({
				assert: "disabled",
				target,
				args: [false],
			}) as const,
		current: (
			target: Locator,
			expected:
				| "true"
				| "false"
				| "page"
				| "step"
				| "location"
				| "date"
				| "time",
		) =>
			({
				assert: "current",
				target,
				args: [expected, false],
				log: `current     : ${target.role} "${target.name}" is not ${expected}`,
			}) as const,
		count: (target: Locator, expected: number) =>
			({
				assert: "count",
				target,
				args: [expected, false],
				log: `count       : ${target.role} "${target.name}" has not ${expected}`,
			}) as const,
		value: (target: Locator, expected: string) =>
			({
				assert: "value",
				target,
				args: [expected, false],
				log: `value       : ${target.role} "${target.name}" has not value "${expected}"`,
			}) as const,
		errormessage: (target: Locator, expected: string) =>
			({
				assert: "errormessage",
				target,
				args: [expected, false],
				log: `${target.role} ${target.name}의 에러 메시지는 "${expected}" 이다.`,
			}) as const,
	},
	a11ySnapshot: (target: Locator, path: string) =>
		({
			assert: "a11ySnapshot",
			target,
			args: [path],
			log: `a11ySnapshot!: ${locatorLog(target)}`,
		}) as const,
	tableSnapshot: (target: Locator, path: string) =>
		({
			assert: "tableSnapshot",
			target,
			args: [path],
			log: `tableSnapshot!: ${locatorLog(target)}`,
		}) as const,
};
