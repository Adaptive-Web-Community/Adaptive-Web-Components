import { FASTSlider } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./slider.styles.js";
import { template } from "./slider.template.js";

/**
 * The Slider custom element definition. Implements {@link @microsoft/fast-foundation#FASTSlider}.
 *
 * @remarks
 * HTML Element: \<adaptive-slider\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTSlider.compose({
        name: `${ds.prefix}-slider`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
