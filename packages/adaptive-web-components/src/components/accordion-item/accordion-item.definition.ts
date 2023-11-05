import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { FASTAccordionItem } from "@microsoft/fast-foundation";
import { adaptiveDesignSystem, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./accordion-item.styles.js";
import { AccordionItemAnatomy } from './accordion-item.template.js';
import { styleModules } from "./accordion-item.styles.modules.js";
import accordionItemOptions from "./accordion-item.options.js";
import { accordionItemTemplate } from "./accordion-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * The Accordion Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordionItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion-item\>
 *
 * @public
 */
export const accordionItemDefinition = FASTAccordionItem.compose({
    name: `${adaptiveDesignSystem.prefix}-${accordionItemOptions.baseName}`,
    template: accordionItemTemplate(accordionItemOptions.templateOptions),
    styles: DesignSystem.assembleStyles(defaultStyles, AccordionItemAnatomy, styleModules)
});