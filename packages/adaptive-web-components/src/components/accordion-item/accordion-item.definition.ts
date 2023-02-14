import { FASTAccordionItem } from "@microsoft/fast-foundation";
import { createAdaptiveDefinition, DesignSystem } from "../../design-system.js";
import { styles } from "./accordion-item.styles.js";
import { template } from "./accordion-item.template.js";

/**
 * The Accordion Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordionItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion-item\>
 *
 * @public
 */
export const definition = createAdaptiveDefinition(
    FASTAccordionItem,
    {
        name: "accordion-item",
        template,
        styles
    }
);