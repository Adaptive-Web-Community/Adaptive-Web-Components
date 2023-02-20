import { FASTAccordionItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./accordion-item.styles.js";
import { AccordionItemIconKeys, template } from "./accordion-item.template.js";

export function composeAccordionItem(
    ds: DesignSystem,
    options?: ComposeOptions<AccordionItemIconKeys, FASTAccordionItem>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(AccordionItemIconKeys.collapsed)) {
            ds.statics.set(
                AccordionItemIconKeys.collapsed,
                options.statics[AccordionItemIconKeys.collapsed]
            );
        }

        if (!ds.statics.has(AccordionItemIconKeys.expanded)) {
            ds.statics.set(
                AccordionItemIconKeys.expanded,
                options.statics[AccordionItemIconKeys.expanded]
            );
        }
    }

    return FASTAccordionItem.compose({
        name: `${ds.prefix}-accordion-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}