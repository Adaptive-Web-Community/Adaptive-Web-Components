import { DefaultDesignSystem } from "../../design-system.js";
import { composeDataGridRow } from "./data-grid-row.compose.js";
import { styleRules } from "./data-grid-row.styles.rules.js";

/**
 * The Data Grid Cell custom element definition. Implements {@link DataGridRow}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid-cell\>
 *
 * @public
 */
export const dataGridRowDefinition = composeDataGridRow(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
