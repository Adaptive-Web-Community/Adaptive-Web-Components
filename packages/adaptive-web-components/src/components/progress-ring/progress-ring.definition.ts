import { DefaultDesignSystem } from "../../design-system.js";
import { composeProgressRing } from "./progress-ring.compose.js";
import { styleRules } from "./progress-ring.styles.rules.js";

/**
 * The Progress Ring custom element definition. Implements {@link ProgressRing}.
 *
 * @remarks
 * HTML Element: \<adaptive-progress-ring\>
 *
 * @public
 */
export const progressRingDefinition = composeProgressRing(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
