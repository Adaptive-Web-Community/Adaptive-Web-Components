import { FASTListboxOption } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./listbox-option.styles.js";
import { template } from "./listbox-option.template.js";

export function composeListboxOption(
    ds: DesignSystem,
    options?: ComposeOptions<FASTListboxOption>
): FASTElementDefinition {
    return FASTListboxOption.compose({
        name: `${ds.prefix}-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}