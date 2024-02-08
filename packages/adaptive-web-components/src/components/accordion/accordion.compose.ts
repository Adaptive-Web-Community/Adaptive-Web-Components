import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./accordion.styles.js";
import { AccordionAnatomy, template } from "./accordion.template.js";
import { Accordion } from "./accordion.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeAccordion(
    ds: DesignSystem,
    options?: ComposeOptions<Accordion>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, AccordionAnatomy, options);

    return Accordion.compose({
        name: `${ds.prefix}-accordion`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
