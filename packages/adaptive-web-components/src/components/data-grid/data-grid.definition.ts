import { DefaultDesignSystem } from "../../design-system.js";
import { composeDataGrid } from "./data-grid.compose.js";
import { styleModules } from "./data-grid.styles.modules.js";

/**
 * The Data Grid custom element definition. Implements {@link @microsoft/fast-foundation#FASTDataGrid}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid\>
 *
 * @public
 */
export const dataGridDefinition = composeDataGrid(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
