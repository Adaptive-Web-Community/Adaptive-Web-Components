import { FASTSlider } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./slider.styles.js";
import { template } from "./slider.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeSlider(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSlider>
): FASTElementDefinition {
    return FASTSlider.compose({
        name: `${ds.prefix}-slider`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}