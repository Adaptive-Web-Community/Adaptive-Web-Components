import { DefaultDesignSystem } from "../../design-system.js";
import { composeSliderLabel } from "./slider-label.compose.js";
import { styleModules } from "./slider-label.styles.modules.js";

/**
 * The Slider Label custom element definition. Implements {@link SliderLabel}.
 *
 * @remarks
 * HTML Element: \<adaptive-slider-label\>
 *
 * @public
 */
export const sliderLabelDefinition = composeSliderLabel(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
