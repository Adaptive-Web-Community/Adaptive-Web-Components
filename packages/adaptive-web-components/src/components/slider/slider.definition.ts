import { DefaultDesignSystem } from "../../design-system.js";
import { composeSlider } from "./slider.compose.js";
import { styleModules } from "./slider.styles.modules.js";

/**
 * The Slider custom element definition. Implements {@link @microsoft/fast-foundation#FASTSlider}.
 *
 * @remarks
 * HTML Element: \<adaptive-slider\>
 *
 * @public
 */
export const sliderDefinition = composeSlider(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
