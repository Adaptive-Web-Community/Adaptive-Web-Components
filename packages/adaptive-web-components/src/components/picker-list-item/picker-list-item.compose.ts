import { FASTPickerListItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./picker-list-item.styles.js";
import { template } from "./picker-list-item.template.js";

export function composePickerListItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerListItem>
): FASTElementDefinition {
    return FASTPickerListItem.compose({
        name: `${ds.prefix}-picker-list-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}