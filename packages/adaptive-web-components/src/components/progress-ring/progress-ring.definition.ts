import { DefaultDesignSystem } from "../../design-system.js";
import { composeProgressRing } from "./progress-ring.compose.js";
import { styleModules } from "./progress-ring.styles.modules.js";

/**
 * The Progress Ring custom element definition. Implements {@link @microsoft/fast-foundation#FASTProgressRing}.
 *
 * @remarks
 * HTML Element: \<adaptive-progress-ring\>
 *
 * @public
 */
export const progressRingDefinition = composeProgressRing(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
