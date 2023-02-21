import { FASTDivider } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./divider.styles.js";
import { template } from "./divider.template.js";

export function composeDivider(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDivider>
): FASTElementDefinition {
    return FASTDivider.compose({
        name: `${ds.prefix}-divider`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}