import { FASTTreeView } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./tree-view.styles.js";
import { template } from "./tree-view.template.js";

/**
 * The tree view custom element definition. Implements {@link @microsoft/fast-foundation#FASTTreeView}.
 *
 * @remarks
 * HTML Element: \<adaptive-tree-view\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTreeView.compose({
        name: `${ds.prefix}-tree-view`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
