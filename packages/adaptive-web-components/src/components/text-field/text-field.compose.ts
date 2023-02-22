import { FASTTextField } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./text-field.styles.js";
import { template } from "./text-field.template.js";

export function composeTextField(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTextField>
): FASTElementDefinition {
    return FASTTextField.compose({
        name: `${ds.prefix}-text-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}