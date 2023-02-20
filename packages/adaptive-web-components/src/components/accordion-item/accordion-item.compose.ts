import { FASTAccordionItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./accordion-item.styles.js";
import { template } from "./accordion-item.template.js";

export function composeAccordionItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAccordionItem, any, any>
): FASTElementDefinition {

    return FASTAccordionItem.compose({
        name: `${ds.prefix}-accordion-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}