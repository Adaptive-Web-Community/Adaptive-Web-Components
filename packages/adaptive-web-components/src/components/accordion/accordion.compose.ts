import { FASTAccordion } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./accordion.styles.js";
import { AccordionAnatomy, template } from "./accordion.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeAccordion(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAccordion>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, AccordionAnatomy.interactivity, options);

    return FASTAccordion.compose({
        name: `${ds.prefix}-accordion`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
