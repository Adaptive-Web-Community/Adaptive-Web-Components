import {
    accordionItemAestheticStyles,
    accordionItemTemplateStyles,
    componentBaseStyles,
    svgIconStyles,
} from "@adaptive-web/components-foundation";
import type { ComposeOptions, DesignSystem, ElementDefinition } from "../../design-system.js";
import { AccordionItem } from "./accordion-item.js";
import { AccordionItemAnatomy, AccordionItemStatics, template } from "./accordion-item.template.js";

const defaultStyles = [componentBaseStyles, accordionItemTemplateStyles, svgIconStyles, accordionItemAestheticStyles];

/**
 * @public
 */
export function composeAccordionItem(
    ds: DesignSystem,
    options?: ComposeOptions<AccordionItem, AccordionItemStatics>
): ElementDefinition<typeof AccordionItem> {
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

    const styles = ds.assembleStyles(defaultStyles, AccordionItemAnatomy, options);
    const render = (options?.template ?? template)(ds);

    return {
        name: `${ds.prefix}-accordion-item`,
        type: class extends AccordionItem {
            public static styles = styles;
            public static shadowRootOptions = { ...AccordionItem.shadowRootOptions, ...options?.shadowRootOptions };

            protected render() {
                return render(this);
            }
        },
        elementOptions: options?.elementOptions,
    };
}
