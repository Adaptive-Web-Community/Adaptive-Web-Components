import { DefaultDesignSystem } from "../../design-system.js";
import { composeTreeView } from "./tree-view.compose.js";

/**
 * The tree view custom element definition. Implements {@link @microsoft/fast-foundation#FASTTreeView}.
 *
 * @remarks
 * HTML Element: \<adaptive-tree-view\>
 *
 * @public
 */
export const treeViewDefinition = composeTreeView(DefaultDesignSystem);