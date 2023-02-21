import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveAnchor } from "./anchor.js";
import { styles } from "./anchor.styles.js";
import { template } from "./anchor.template.js";

export function composeAnchor(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveAnchor>
): FASTElementDefinition {
    return AdaptiveAnchor.compose({
        name: `${ds.prefix}-anchor`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}