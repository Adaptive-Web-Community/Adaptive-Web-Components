import { DefaultDesignSystem } from "../../design-system.js";
import { composeProgress } from "./progress.compose.js";
import { styleRules } from "./progress.styles.rules.js";

/**
 * The Progress custom element definition. Implements {@link Progress}.
 *
 * @remarks
 * HTML Element: \<adaptive-progress\>
 *
 * @public
 */
export const progressDefinition = composeProgress(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
