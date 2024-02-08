import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./picker-list-item.styles.js";
import { PickerListItemAnatomy, template } from "./picker-list-item.template.js";
import { PickerListItem } from "./picker-list-item.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePickerListItem(
    ds: DesignSystem,
    options?: ComposeOptions<PickerListItem>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, PickerListItemAnatomy, options);

    return PickerListItem.compose({
        name: `${ds.prefix}-picker-list-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
