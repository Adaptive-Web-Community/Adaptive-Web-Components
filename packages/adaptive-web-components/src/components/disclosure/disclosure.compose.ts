import { FASTDisclosure } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./disclosure.styles.js";
import { DisclosureAnatomy, template } from "./disclosure.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDisclosure(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDisclosure>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DisclosureAnatomy, options);

    return FASTDisclosure.compose({
        name: `${ds.prefix}-disclosure`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
