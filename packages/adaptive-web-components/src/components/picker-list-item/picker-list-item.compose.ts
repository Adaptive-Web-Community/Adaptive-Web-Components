import { FASTPickerListItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker-list-item.styles.js";
import { PickerListItemAnatomy, template } from "./picker-list-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePickerListItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerListItem>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, PickerListItemAnatomy, options);

    return FASTPickerListItem.compose({
        name: `${ds.prefix}-picker-list-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
