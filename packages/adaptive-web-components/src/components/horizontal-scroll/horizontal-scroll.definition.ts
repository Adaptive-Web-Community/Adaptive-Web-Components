import { DefaultDesignSystem } from "../../design-system.js";
import { composeHorizontalScroll } from "./horizontal-scroll.compose.js";
import { styleModules } from "./horizontal-scroll.styles.modules.js";

/**
 * The Horizontal Scroll custom element definition. Implements {@link @microsoft/fast-foundation#FASTHorizontalScroll}.
 *
 * @remarks
 * HTML Element: \<adaptive-horizontal-scroll\>
 *
 * @public
 */
export const horizontalScrollDefinition = composeHorizontalScroll(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
