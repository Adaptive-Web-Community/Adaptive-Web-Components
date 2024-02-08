import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./slider-label.styles.js";
import { SliderLabelAnatomy, template } from "./slider-label.template.js";
import { SliderLabel } from "./slider-label.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSliderLabel(
    ds: DesignSystem,
    options?: ComposeOptions<SliderLabel>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, SliderLabelAnatomy, options);

    return SliderLabel.compose({
        name: `${ds.prefix}-slider-label`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
