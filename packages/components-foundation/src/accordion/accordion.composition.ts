import type { ComponentComposition } from "../design-system/composition.js";
import { componentBaseStyles } from "../styles/styles.js";
import { accordionAestheticStyles, AccordionAnatomy, accordionTemplateStyles } from "./accordion.styles.js";

/**
 * What a design system composes an {@link AccordionElement} from.
 *
 * @public
 */
export const accordionComposition: ComponentComposition = {
    name: "accordion",
    styles: [componentBaseStyles, accordionTemplateStyles, accordionAestheticStyles],
    anatomy: AccordionAnatomy,
};
