import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Slider } from "./slider.js";
import { aestheticStyles, templateStyles } from "./slider.styles.js";
import { SliderAnatomy, template } from "./slider.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSlider(
    ds: DesignSystem,
    options?: ComposeOptions<Slider>
): Promise<FASTElementDefinition<typeof Slider>> {
    const styles = ds.assembleStyles(defaultStyles, SliderAnatomy, options);

    return FASTElementDefinition.compose(Slider, {
        name: `${ds.prefix}-slider`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
