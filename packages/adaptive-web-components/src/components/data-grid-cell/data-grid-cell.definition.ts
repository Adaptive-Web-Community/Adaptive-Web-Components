import { DefaultDesignSystem } from "../../design-system.js";
import { composeDataGridCell } from "./data-grid-cell.compose.js";
import { styleModules } from "./data-grid-cell.styles.modules.js";

/**
 * The Data Grid Cell custom element definition. Implements {@link @microsoft/fast-foundation#FASTDataGridCell}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid-cell\>
 *
 * @public
 */
export const dataGridCellDefinition = composeDataGridCell(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
