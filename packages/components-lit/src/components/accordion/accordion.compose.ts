import { accordionAestheticStyles, accordionTemplateStyles, componentBaseStyles } from "@adaptive-web/components-foundation";
import type { ComposeOptions, DesignSystem, ElementDefinition } from "../../design-system.js";
import { Accordion } from "./accordion.js";
import { AccordionAnatomy, template } from "./accordion.template.js";

const defaultStyles = [componentBaseStyles, accordionTemplateStyles, accordionAestheticStyles];

/**
 * @public
 */
export function composeAccordion(ds: DesignSystem, options?: ComposeOptions<Accordion>): ElementDefinition<typeof Accordion> {
    const styles = ds.assembleStyles(defaultStyles, AccordionAnatomy, options);
    const render = (options?.template ?? template)(ds);

    return {
        name: `${ds.prefix}-accordion`,
        type: class extends Accordion {
            public static styles = styles;
            public static shadowRootOptions = { ...Accordion.shadowRootOptions, ...options?.shadowRootOptions };

            protected render() {
                return render(this);
            }
        },
        elementOptions: options?.elementOptions,
    };
}
