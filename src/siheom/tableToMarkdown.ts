const koreanRegex =
	/[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]/g;

function calculateTextWidth(text: string) {
	const koreanCount = (text.match(koreanRegex) || []).length;
	const totalCount = text.length + koreanCount;
	return totalCount;
}

export function tableToMarkdown(tableElement: HTMLTableElement) {
	// Get all rows including header
	const allRows = [
		...Array.from(
			tableElement.querySelectorAll(
				':is(thead, [aria-roledescription="tableheader"]) :is(tr, [role="row"])',
			),
		),
		...Array.from(
			tableElement.querySelectorAll(
				':is(tbody, [aria-roledescription="tablebody"]) :is(tr, [role="row"])',
			),
		),
	];

	// Extract cell contents
	const cellContents = allRows.map((row) =>
		Array.from(
			row.querySelectorAll('th, td, [role="cell"], [role="columnheader"]'),
		).map((cell) => {
			const cellInput = cell.querySelector("input, progress") as
				| HTMLInputElement
				| HTMLProgressElement
				| null;

			return cellInput
				? String(cellInput.value)
				: (cell.textContent?.trim() ?? "");
		}),
	);

	const firstRow = cellContents[0];

	if (firstRow === undefined) {
		throw new Error("there is no rows in table!");
	}

	// Calculate max width for each column
	const columnWidths = firstRow.map((_, colIndex) =>
		Math.max(
			...cellContents.map((row) => calculateTextWidth(row[colIndex] ?? "")),
		),
	);

	// Pad cells and create markdown
	let markdown = "";

	cellContents.forEach((row, rowIndex) => {
		const paddedRow = row.map((cell, cellIndex) => {
			const contentWidth = calculateTextWidth(cell);
			const columnWidth = columnWidths[cellIndex] ?? 0;

			return " ".repeat(columnWidth - contentWidth) + cell;
		});

		markdown += `| ${paddedRow.join(" | ")} |\n`;

		// Add separator after header
		if (rowIndex === 0) {
			markdown += `| ${columnWidths.map((width) => "-".repeat(width)).join(" | ")} |\n`;
		}
	});

	return markdown;
}
