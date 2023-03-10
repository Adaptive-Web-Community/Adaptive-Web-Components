import { FASTPickerListItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker-list-item.styles.js";
import { template } from "./picker-list-item.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

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