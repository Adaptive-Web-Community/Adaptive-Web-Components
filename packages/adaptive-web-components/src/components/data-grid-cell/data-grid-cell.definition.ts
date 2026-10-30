import { DefaultDesignSystem } from "../../design-system.js";
import { composeDataGridCell } from "./data-grid-cell.compose.js";
import { styleRules } from "./data-grid-cell.styles.rules.js";

/**
 * The Data Grid Cell custom element definition. Implements {@link DataGridCell}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid-cell\>
 *
 * @public
 */
export const dataGridCellDefinition = composeDataGridCell(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
