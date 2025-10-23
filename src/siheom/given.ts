import { render } from "@testing-library/react";
import type { GivenStep } from "./types";
import type { ReactElement } from "react";

export const defaultGivens = {
	render: async (element: ReactElement) => {
		render(element);
	},
} satisfies Record<
	string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(...args: any[]) => Promise<void>
>;

export const given = {
	render: (element: ReactElement) => ({
		given: "render",
		log: "렌더한다",
		args: [element],
	}),
} satisfies Record<
	string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(...args: any[]) => GivenStep
>;
