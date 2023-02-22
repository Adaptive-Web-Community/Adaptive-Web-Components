import { FASTPickerMenuOption } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker-menu-option.styles.js";
import { template } from "./picker-menu-option.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composePickerMenuOption(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerMenuOption>
): FASTElementDefinition {
    return FASTPickerMenuOption.compose({
        name: `${ds.prefix}-picker-menu-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}