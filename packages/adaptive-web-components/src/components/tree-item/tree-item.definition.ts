import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeTreeItem } from "./tree-item.compose.js";
import { TreeItemStatics } from "./tree-item.template.js";
import { styleModules } from "./tree-item.styles.modules.js";

/**
 * The tree item custom element definition. Implements {@link @microsoft/fast-foundation#FASTTreeItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-tree-item\>
 *
 * @public
 */
export const treeItemDefinition = composeTreeItem(
    DefaultDesignSystem,
    {
        statics: {
            [TreeItemStatics.expandCollapse]: chevronRightIcon
        },
        styleModules,
    }
);
