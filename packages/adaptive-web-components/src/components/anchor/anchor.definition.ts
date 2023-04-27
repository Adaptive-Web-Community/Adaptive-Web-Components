import { DefaultDesignSystem } from "../../design-system.js";
import { composeAnchor } from "./anchor.compose.js";
import { styleModules } from "./anchor.styles.modules.js";

/**
 * The Anchor custom element definition. Implements {@link AdaptiveAnchor}.
 *
 * @remarks
 * HTML Element: \<adaptive-anchor\>
 *
 * @public
 */
export const anchorDefinition = composeAnchor(
    DefaultDesignSystem,
    {
        styleModules,
        shadowOptions: {
            delegatesFocus: true
        },
    }
);
