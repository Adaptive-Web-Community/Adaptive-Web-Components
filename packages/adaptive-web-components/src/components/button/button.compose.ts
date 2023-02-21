import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveButton } from "./button.js";
import { styles } from "./button.styles.js";
import { template } from "./button.template.js";

export function composeButton(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveButton>
): FASTElementDefinition {
    return AdaptiveButton.compose({
        name: `${ds.prefix}-button`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}