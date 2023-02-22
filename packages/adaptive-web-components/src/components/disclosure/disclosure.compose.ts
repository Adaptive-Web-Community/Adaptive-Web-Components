import { FASTDisclosure } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./disclosure.styles.js";
import { template } from "./disclosure.template.js";

export function composeDisclosure(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDisclosure>
): FASTElementDefinition {
    return FASTDisclosure.compose({
        name: `${ds.prefix}-disclosure`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}