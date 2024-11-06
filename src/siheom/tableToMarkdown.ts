function calculateTextWidth(text: string) {
	const koreanRegex = /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF]/g;
	const koreanCount = (text.match(koreanRegex) || []).length;
	const totalCount = text.length + koreanCount;
	return totalCount;
}

export function tableToMarkdown(tableElement: HTMLElement) {
	// Get all rows including header
	const allRows = [
		...Array.from(tableElement.querySelectorAll(':is(thead, [aria-roledescription="tableheader"]) :is(tr, [role="row"])')),
		...Array.from(tableElement.querySelectorAll(':is(tbody, [aria-roledescription="tablebody"]) :is(tr, [role="row"])'))
	];

	// Extract cell contents
	const cellContents = allRows.map(row =>
		Array.from(row.querySelectorAll('th, td, [role="cell"], [role="columnheader"]')).map(cell => {

			const cellInput = cell.querySelector('input, progress') as HTMLInputElement;

			return cellInput ? String(cellInput.value) : cell.textContent?.trim() ?? ''
		})
	);

	// Calculate max width for each column
	const columnWidths = cellContents[0]?.map((_, colIndex) =>
		Math.max(...cellContents.map(row => calculateTextWidth(row[colIndex] ?? "")))
	) ?? ([] as number[]);

	// Pad cells and create markdown
	let markdown = '';

	cellContents.forEach((row, rowIndex) => {
		const paddedRow = row.map((cell, cellIndex) => {
			const contentWidth = calculateTextWidth(cell)
			const columnWidth = columnWidths[cellIndex] as number

			return ' '.repeat(columnWidth - contentWidth) + cell
		});

		markdown += `| ${paddedRow.join(' | ')} |\n`;

		// Add separator after header
		if (rowIndex === 0) {
			markdown += `| ${columnWidths.map(width => '-'.repeat(width)).join(' | ')} |\n`;
		}
	});

	return markdown;
}