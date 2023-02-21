import { FASTRadioGroup } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./radio-group.styles.js";
import { template } from "./radio-group.template.js";

export function composeRadioGroup(
    ds: DesignSystem,
    options?: ComposeOptions<FASTRadioGroup>
): FASTElementDefinition {
    return FASTRadioGroup.compose({
        name: `${ds.prefix}-radio-group`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}