import { FASTSliderLabel } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./slider-label.styles.js";
import { template } from "./slider-label.template.js";

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