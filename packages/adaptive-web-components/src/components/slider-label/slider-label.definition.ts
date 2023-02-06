import { FASTSliderLabel } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./slider-label.styles.js";
import { template } from "./slider-label.template.js";

/**
 * The Slider Label custom element definition. Implements {@link "@microsoft/fast-foundation#FASTSliderLabel}.
 *
 * @remarks
 * HTML Element: \<adaptive-slider-label\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTSliderLabel.compose({
        name: `${ds.prefix}-slider-label`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
