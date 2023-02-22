import { FASTAccordion } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./accordion.styles.js";
import { template } from "./accordion.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeAccordion(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAccordion>
): FASTElementDefinition {

    return FASTAccordion.compose({
        name: `${ds.prefix}-accordion`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}