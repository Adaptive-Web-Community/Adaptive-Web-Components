import { DefaultDesignSystem } from "../../design-system.js";
import { composeList } from "./list.compose.js";
import { styleModules } from "./list.styles.modules.js";

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
        styleModules,
    }
);
