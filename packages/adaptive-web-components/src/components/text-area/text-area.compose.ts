import { FASTTextArea } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./text-area.styles.js";
import { template } from "./text-area.template.js";

export function composeTextArea(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTextArea>
): FASTElementDefinition {
    return FASTTextArea.compose({
        name: `${ds.prefix}-text-area`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}