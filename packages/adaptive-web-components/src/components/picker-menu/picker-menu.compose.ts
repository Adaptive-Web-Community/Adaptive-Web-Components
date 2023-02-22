import { FASTPickerMenu } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./picker-menu.styles.js";
import { template } from "./picker-menu.template.js";

export function composePickerMenu(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerMenu>
): FASTElementDefinition {
    return FASTPickerMenu.compose({
        name: `${ds.prefix}-picker-menu`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}