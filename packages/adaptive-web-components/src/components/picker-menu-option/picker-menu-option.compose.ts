import { FASTPickerMenuOption } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./picker-menu-option.styles.js";
import { PickerMenuOptionAnatomy, template } from "./picker-menu-option.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePickerMenuOption(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerMenuOption>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, PickerMenuOptionAnatomy, options);

    return FASTPickerMenuOption.compose({
        name: `${ds.prefix}-picker-menu-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
