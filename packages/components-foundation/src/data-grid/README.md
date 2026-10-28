# Data Grid, Data Grid Row, and Data Grid Cell

A data grid (`role="grid"`) has rows of cells, which the user moves between with the keys, and can select rows of: the
[ARIA data grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).

- Contract: `DataGridElement`, `DataGridSelectionMode`, and `DataGridParts` (`data-grid.ts`), `DataGridRowElement`, `DataGridRowType`, and
  `dataGridRowAria` (`../data-grid-row/data-grid-row.ts`), `DataGridCellElement`, `DataGridCellType`, and `dataGridCellAria`
  (`../data-grid-cell/data-grid-cell.ts`).
- Behavior: `DataGridController` (`data-grid.controller.ts`).

The rows and cells are the author's, written in the slots, or rendered by a binding: AWC keeps FAST Foundation's `rowsData` and
`columnDefinitions`, whose templates are FAST templates, so generating them isn't the foundation's. The controller finds the rows and cells
through `rows` and `cells`, and the focus through the events' paths, so they can be in the shadow roots.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Rows | Generated from `rowsData` and `columnDefinitions`, or the author's | Both: the author's in the slot, and AWC's generated ones, with a header row (`generate-header`) |
| Roles | Written to the hosts | `ElementInternals`: `grid`, `row`, and `gridcell`, `columnheader`, or `rowheader` by `cell-type` |
| Columns | `grid-template-columns` on the grid and each row, and `grid-column` on each cell, as inline styles | `grid-template-columns`, as the `--data-grid-template-columns` custom property, which every row inherits and lays out its cells in; the cells are placed in order |
| Keys | Arrows, Home and End with Control, Page Up and Page Down, Control with A | The ARIA pattern: the arrows (swapped right to left), Home and End in the row, with Control in the grid, Page Up and Page Down by the rows that fit, Control with A |
| A cell's content | Focus callbacks and queues in each column definition | Enter or F2 moves into it, and Escape back, for every cell; its controls are out of the tab order, also those added later, as the ARIA pattern has it |
| Selection | `selection-mode` (`single-row`, `multi-row`), `selection-behavior`, `initial-row-selection` | `selection-mode`, and each row's `selected`, reflected: a click or Space selects, or toggles in `multi-row`, and Control with A selects all; `change` from the row |
| Tab order | One cell, or none with `no-tabbing` | One cell: the last focused, or the first |

Considered and not taken:

- `selection-behavior`, `initial-row-selection`, `disable-click-select`, and `no-tabbing`: add them on the first real use.
- Shift with a click or the arrows to select ranges.
- Virtualization, with `aria-rowindex` and `aria-colindex`: the rows are all in the DOM.
- A static table: a native `<table>`; the data grid is for interactive data.
