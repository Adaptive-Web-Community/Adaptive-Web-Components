import { FASTBadge } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./badge.styles.js";
import { template } from "./badge.template.js";

export function composeBadge(
    ds: DesignSystem,
    options?: ComposeOptions<FASTBadge>
): FASTElementDefinition {
    return FASTBadge.compose({
        name: `${ds.prefix}-badge`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}