import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./picker-menu-option.styles.js";
import { PickerMenuOptionAnatomy, template } from "./picker-menu-option.template.js";
import { PickerMenuOption } from "./picker-menu-option.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePickerMenuOption(
    ds: DesignSystem,
    options?: ComposeOptions<PickerMenuOption>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, PickerMenuOptionAnatomy, options);

    return PickerMenuOption.compose({
        name: `${ds.prefix}-picker-menu-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
