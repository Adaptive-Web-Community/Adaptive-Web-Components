import { FASTSlider } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./slider.styles.js";
import { SliderAnatomy, template } from "./slider.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSlider(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSlider>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, SliderAnatomy, options);

    return FASTSlider.compose({
        name: `${ds.prefix}-slider`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
