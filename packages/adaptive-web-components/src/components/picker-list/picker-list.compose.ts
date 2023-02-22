import { FASTPickerList } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./picker-list.styles.js";
import { template } from "./picker-list.template.js";

export function composePickerList(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerList>
): FASTElementDefinition {
    return FASTPickerList.compose({
        name: `${ds.prefix}-picker-list`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}