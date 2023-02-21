import { FASTTreeItem } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./tree-item.styles.js";
import { template } from "./tree-item.template.js";

/**
 * The tree item custom element definition. Implements {@link @microsoft/fast-foundation#FASTTreeItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-tree-item\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTreeItem.compose({
        name: `${ds.prefix}-tree-item`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
