import { FASTDataGrid } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./data-grid.styles.js";
import { template } from "./data-grid.template.js";

/**
 * The Data Grid custom element definition. Implements {@link @microsoft/fast-foundation#FASTDataGrid}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTDataGrid.compose({
        name: `${ds.prefix}-data-grid`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
