import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./picker-menu.styles.js";
import { PickerMenuAnatomy, template } from "./picker-menu.template.js";
import { PickerMenu } from "./picker-menu.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePickerMenu(
    ds: DesignSystem,
    options?: ComposeOptions<PickerMenu>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, PickerMenuAnatomy, options);

    return PickerMenu.compose({
        name: `${ds.prefix}-picker-menu`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
