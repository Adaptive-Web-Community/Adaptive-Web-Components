import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./accordion-item.styles.js";
import { AccordionItemAnatomy, AccordionItemStatics, template } from "./accordion-item.template.js";
import { AccordionItem } from "./accordion-item.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeAccordionItem(
    ds: DesignSystem,
    options?: ComposeOptions<AccordionItem, AccordionItemStatics>
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

    const styles = DesignSystem.assembleStyles(defaultStyles, AccordionItemAnatomy, options);

    return AccordionItem.compose({
        name: `${ds.prefix}-accordion-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
