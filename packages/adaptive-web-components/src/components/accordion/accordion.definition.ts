import { FASTAccordion } from "@microsoft/fast-foundation";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { adaptiveDesignSystem, DesignSystem } from "../../design-system.js";
import { styleModules } from "./accordion.styles.modules.js";
import { AccordionAnatomy, accordionTemplate } from "./accordion.template.js";
import { aestheticStyles, templateStyles } from "./accordion.styles.js";
import accordionOptions from "./accordion.options.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * The Accordion custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordion}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion\>
 *
 * @public
 */
export const accordionDefinition = FASTAccordion.compose({
    name: `${adaptiveDesignSystem.prefix}-${accordionOptions.baseName}`,
    template: accordionTemplate(),
    styles: DesignSystem.assembleStyles(defaultStyles, AccordionAnatomy, styleModules)
});