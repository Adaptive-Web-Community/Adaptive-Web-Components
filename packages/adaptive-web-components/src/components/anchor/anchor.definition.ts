import { DefaultDesignSystem } from "../../design-system.js";
import { composeAnchor } from "./anchor.compose.js";
import { styleModules } from "./anchor.styles.modules.js";

/**
 * The Anchor custom element definition. Implements {@link Anchor}.
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
            // Focusing the element focuses the native link, and the element's tabindex is the link's (a toolbar's roving focus).
            delegatesFocus: true,
        },
    }
);
