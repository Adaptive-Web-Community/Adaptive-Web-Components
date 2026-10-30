import { DefaultDesignSystem } from "../../design-system.js";
import { composeSkeleton } from "./skeleton.compose.js";
import { styleRules } from "./skeleton.styles.rules.js";

/**
 * The Skeleton custom element definition. Implements {@link Skeleton}.
 *
 * @remarks
 * HTML Element: \<adaptive-skeleton\>
 *
 * @public
 */
export const skeletonDefinition = composeSkeleton(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
