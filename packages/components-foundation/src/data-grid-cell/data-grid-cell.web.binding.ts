import { Focus, Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { DataGridCellCellType } from "./data-grid-cell.generated.js";
import { dataGridCellTypeAttribute } from "./data-grid-cell.web.aria.js";
import { dataGridCellDocumentation } from "./data-grid-cell.documentation.js";

/**
 * Web platform selectors and style hooks for {@link dataGridCellDocumentation}.
 *
 * @public
 */
export const dataGridCellWebBinding = {
    conditionSelectors: {
        cellType: {
            default: `[cell-type='${dataGridCellTypeAttribute[DataGridCellCellType.default]}'], :not([cell-type])`,
            columnHeader: `[cell-type='${dataGridCellTypeAttribute[DataGridCellCellType.columnHeader]}']`,
            rowHeader: `[cell-type='${dataGridCellTypeAttribute[DataGridCellCellType.rowHeader]}']`,
        },
    },
    partSelectors: {},
    interactivity: Interactivity.never,
    focus: Focus.contextFocused(),
} satisfies PlatformBindingFor<typeof dataGridCellDocumentation>;
