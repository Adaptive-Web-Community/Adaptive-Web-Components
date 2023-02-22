import { FASTProgressRing } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./progress-ring.styles.js";
import { template } from "./progress-ring.template.js";

export function composeProgressRing(
    ds: DesignSystem,
    options?: ComposeOptions<FASTProgressRing>
): FASTElementDefinition {
    return FASTProgressRing.compose({
        name: `${ds.prefix}-progress-ring`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}