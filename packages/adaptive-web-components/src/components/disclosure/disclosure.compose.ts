import { FASTDisclosure } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./disclosure.styles.js";
import { template } from "./disclosure.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeDisclosure(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDisclosure>
): FASTElementDefinition {
    return FASTDisclosure.compose({
        name: `${ds.prefix}-disclosure`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}