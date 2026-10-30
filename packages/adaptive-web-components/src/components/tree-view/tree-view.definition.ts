import { DefaultDesignSystem } from "../../design-system.js";
import { composeTreeView } from "./tree-view.compose.js";
import { styleRules } from "./tree-view.styles.rules.js";

/**
 * The tree view custom element definition. Implements {@link TreeView}.
 *
 * @remarks
 * HTML Element: \<adaptive-tree-view\>
 *
 * @public
 */
export const treeViewDefinition = composeTreeView(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
