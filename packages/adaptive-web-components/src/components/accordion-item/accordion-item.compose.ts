import { FASTAccordionItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles as defaultStyles } from "./accordion-item.styles.js";
import { template as defaultTemplate } from "./accordion-item.template.js";

export function composeAccordionItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAccordionItem, any>
): FASTElementDefinition {

    return FASTAccordionItem.compose({
        name: `${ds.prefix}-accordion-item`,
        template: options?.template?.(ds) ?? defaultTemplate(ds),
        styles: options?.styles ?? defaultStyles,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}