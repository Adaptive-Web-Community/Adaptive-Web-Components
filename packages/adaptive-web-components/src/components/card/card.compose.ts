import { FASTCard } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./card.styles.js";
import { template } from "./card.template.js";

export function composeCard(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCard>
): FASTElementDefinition {
    return FASTCard.compose({
        name: `${ds.prefix}-card`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}