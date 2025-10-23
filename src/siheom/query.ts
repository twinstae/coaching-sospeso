import { screen } from "@testing-library/dom";
import type { Locator } from "./types";

export const getElement = <T extends boolean>(
	locator: Locator,
	isVisible: T,
): T extends true ? HTMLElement : HTMLElement | null => {
	if (locator.role === "label") {
		if (isVisible) {
			return screen.getByLabelText(locator.name);
		}
		return screen.queryByLabelText(locator.name) as HTMLElement;
	}

	if (isVisible) {
		return screen.getByRole(locator.role, { name: locator.name });
	}
	return screen.queryByRole(locator.role, {
		name: locator.name,
	}) as HTMLElement;
};

export const getElements = <T extends boolean>(
	locator: Locator,
	isVisible: T,
): T extends true ? HTMLElement[] : HTMLElement[] | null => {
	if (locator.role === "label") {
		if (isVisible) {
			return screen.getAllByLabelText(locator.name);
		}
		return screen.queryAllByLabelText(locator.name);
	}
	if (isVisible) {
		return screen.getAllByRole(locator.role, {
			name: locator.name,
		});
	}
	return screen.queryAllByRole(locator.role, {
		name: locator.name,
	});
};

export function locatorLog(target: Locator) {
	if (typeof target.name === "string") {
		return `${target.role} "${target.name}"`;
	}
	return `${target.role} ${target.name}`;
}

const ROLES = [
	"article",
	"cell",
	"columnheader",
	"definition",
	"directory",
	"document",
	"figure",
	"group",
	"heading",
	"img",
	"list",
	"listitem",
	"meter",
	"row",
	"rowgroup",
	"rowheader",
	"separator",
	"table",
	"term",
	"blockquote",
	"caption",
	"code",
	"deletion",
	"emphasis",
	"insertion",
	"paragraph",
	"strong",
	"subscript",
	"superscript",
	"time",

	"scrollbar",
	"searchbox",
	"separator",
	"slider",
	"spinbutton",
	"switch",
	"tab",
	"tabpanel",
	"treeitem",

	"button",
	"checkbox",
	"gridcell",
	"link",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"option",
	"progressbar",
	"radio",
	"textbox",

	"combobox",
	"menu",
	"menubar",
	"tablist",
	"tree",
	"treegrid",

	"banner",
	"complementary",
	"contentinfo",
	"form",
	"main",
	"navigation",
	"region",
	"search",

	"alert",
	"log",
	"marquee",
	"status",
	"timer",

	"alertdialog",
	"dialog",

	"label",
	"text",
] as const;

export const query = Object.fromEntries(
	ROLES.map((role) => [role, (name: string | RegExp) => ({ role, name })]),
) as Record<(typeof ROLES)[number], (name: string | RegExp) => Locator>;
