import { FASTDataGridRow } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./data-grid-row.styles.js";
import { template } from "./data-grid-row.template.js";

/**
 * The Data Grid Cell custom element definition. Implements {@link @microsoft/fast-foundation#FASTDataGridRow}.
 *
 * @remarks
 * HTML Element: \<adaptive-data-grid-cell\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTDataGridRow.compose({
        name: `${ds.prefix}-data-grid-row`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
