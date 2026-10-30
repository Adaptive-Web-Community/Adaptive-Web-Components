import { DefaultDesignSystem } from "../../design-system.js";
import { composeDialog } from "./dialog.compose.js";
import { styleRules } from "./dialog.styles.rules.js";

/**
 * The Dialog custom element definition. Implements {@link Dialog}.
 *
 * @remarks
 * HTML Element: \<adaptive-dialog\>
 *
 * @public
 */
export const dialogDefinition = composeDialog(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
