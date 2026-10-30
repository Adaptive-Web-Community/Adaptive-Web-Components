import { DefaultDesignSystem } from "../../design-system.js";
import { composeListItem } from "./list-item.compose.js";
import { styleRules } from "./list-item.styles.rules.js";

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
        styleRules,
    }
);
