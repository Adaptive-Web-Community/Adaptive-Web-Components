import { FASTAccordionItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./accordion-item.styles.js";
import { AccordionItemStatics, template } from "./accordion-item.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeAccordionItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAccordionItem, AccordionItemStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(AccordionItemStatics.collapsed)) {
            ds.statics.set(
                AccordionItemStatics.collapsed,
                options.statics[AccordionItemStatics.collapsed]
            );
        }

        if (!ds.statics.has(AccordionItemStatics.expanded)) {
            ds.statics.set(
                AccordionItemStatics.expanded,
                options.statics[AccordionItemStatics.expanded]
            );
        }
    }

    return FASTAccordionItem.compose({
        name: `${ds.prefix}-accordion-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}