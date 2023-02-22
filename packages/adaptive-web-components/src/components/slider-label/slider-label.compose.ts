import { FASTSliderLabel } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./slider-label.styles.js";
import { template } from "./slider-label.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeSliderLabel(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSliderLabel>
): FASTElementDefinition {
    return FASTSliderLabel.compose({
        name: `${ds.prefix}-slider-label`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}