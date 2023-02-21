import { FASTAvatar } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./avatar.styles.js";
import { template } from "./avatar.template.js";

export function composeAvatar(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAvatar>
): FASTElementDefinition {
    return FASTAvatar.compose({
        name: `${ds.prefix}-avatar`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}