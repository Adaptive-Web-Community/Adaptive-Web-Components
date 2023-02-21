import { DefaultDesignSystem } from "../../design-system.js";
import { composeSlider } from "./slider.compose.js";

/**
 * The Slider custom element definition. Implements {@link @microsoft/fast-foundation#FASTSlider}.
 *
 * @remarks
 * HTML Element: \<adaptive-slider\>
 *
 * @public
 */
export const sliderDefinition = composeSlider(DefaultDesignSystem);