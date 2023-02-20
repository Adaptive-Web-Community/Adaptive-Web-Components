import { FASTAccordion } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./accordion.styles.js";
import { template } from "./accordion.template.js";

export function composeAccordion(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAccordion>
): FASTElementDefinition {

    return FASTAccordion.compose({
        name: `${ds.prefix}-accordion`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}