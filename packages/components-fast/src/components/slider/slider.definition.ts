import type { ComponentDefinition } from "../../design-system.js";
import { composeSlider } from "./slider.compose.js";
import { styleRules } from "./slider.styles.rules.js";

/**
 * The Slider custom element definition. Implements {@link Slider}.
 *
 * @remarks
 * HTML Element: \<adaptive-slider\>
 *
 * @public
 */
export const sliderDefinition: ComponentDefinition = ds => composeSlider(
    ds,
    {
        styleRules,
    }
);
