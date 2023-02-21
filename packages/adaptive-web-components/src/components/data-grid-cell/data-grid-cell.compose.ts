import { FASTDataGridCell } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./data-grid-cell.styles.js";
import { template } from "./data-grid-cell.template.js";

/**
 * The Data Grid Cell custom element definition. Implements {@link @microsoft/fast-foundation#FASTDataGridCell}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid-cell\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTDataGridCell.compose({
        name: `${ds.prefix}-data-grid-cell`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
