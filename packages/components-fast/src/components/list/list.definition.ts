import { DefaultDesignSystem } from "../../design-system.js";
import { composeList } from "./list.compose.js";
import { styleRules } from "./list.styles.rules.js";

/**
 * The List custom element definition. Implements {@link List}.
 *
 * @remarks
 * HTML Element: \<adaptive-list\>
 *
 * @public
 */
export const listDefinition = composeList(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
