import { FASTPickerMenuOption } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker-menu-option.styles.js";
import { PickerMenuOptionAnatomy, template } from "./picker-menu-option.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composePickerMenuOption(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerMenuOption>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, PickerMenuOptionAnatomy.interactivity, options);

    return FASTPickerMenuOption.compose({
        name: `${ds.prefix}-picker-menu-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
