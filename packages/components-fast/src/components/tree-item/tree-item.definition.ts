import { chevronRightIcon } from "@adaptive-web/components-foundation";
import type { ComponentDefinition } from "../../design-system.js";
import { composeTreeItem } from "./tree-item.compose.js";
import { TreeItemStatics } from "./tree-item.template.js";
import { styleRules } from "./tree-item.styles.rules.js";

/**
 * The tree item custom element definition. Implements {@link TreeItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-tree-item\>
 *
 * @public
 */
export const treeItemDefinition: ComponentDefinition = ds => composeTreeItem(
    ds,
    {
        statics: {
            [TreeItemStatics.expandCollapse]: chevronRightIcon,
        },
        styleRules,
    }
);
