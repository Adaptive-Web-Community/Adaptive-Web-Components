import { FASTSlider } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./slider.styles.js";
import { SliderAnatomy, template } from "./slider.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeSlider(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSlider>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, SliderAnatomy.interactivity, options);

    return FASTSlider.compose({
        name: `${ds.prefix}-slider`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
