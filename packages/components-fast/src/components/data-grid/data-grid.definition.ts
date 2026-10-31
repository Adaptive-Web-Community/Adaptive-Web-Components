import type { ComponentDefinition } from "../../design-system.js";
import { composeDataGrid } from "./data-grid.compose.js";
import { styleRules } from "./data-grid.styles.rules.js";

/**
 * The Data Grid custom element definition. Implements {@link DataGrid}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid\>
 *
 * @public
 */
export const dataGridDefinition: ComponentDefinition = ds => composeDataGrid(
    ds,
    {
        styleRules,
    }
);
