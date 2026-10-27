import { DefaultDesignSystem } from "../../design-system.js";
import { composeListItem } from "./list-item.compose.js";
import { styleModules } from "./list-item.styles.modules.js";

/**
 * The List Item custom element definition. Implements {@link ListItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-list-item\>
 *
 * @public
 */
export const listItemDefinition = composeListItem(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
