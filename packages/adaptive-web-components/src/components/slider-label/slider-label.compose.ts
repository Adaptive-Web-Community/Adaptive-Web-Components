import { FASTSliderLabel } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./slider-label.styles.js";
import { SliderLabelAnatomy, template } from "./slider-label.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSliderLabel(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSliderLabel>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, SliderLabelAnatomy, options);

    return FASTSliderLabel.compose({
        name: `${ds.prefix}-slider-label`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
