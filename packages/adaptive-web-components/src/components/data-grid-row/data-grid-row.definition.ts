import { DefaultDesignSystem } from "../../design-system.js";
import { composeDataGridRow } from "./data-grid-row.compose.js";
import { styleModules } from "./data-grid-row.styles.modules.js";

/**
 * The Data Grid Cell custom element definition. Implements {@link @microsoft/fast-foundation#FASTDataGridRow}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid-cell\>
 *
 * @public
 */
export const dataGridRowDefinition = composeDataGridRow(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
