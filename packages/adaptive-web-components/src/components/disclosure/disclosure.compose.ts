import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./disclosure.styles.js";
import { DisclosureAnatomy, template } from "./disclosure.template.js";
import { Disclosure } from "./disclosure.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDisclosure(
    ds: DesignSystem,
    options?: ComposeOptions<Disclosure>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DisclosureAnatomy, options);

    return Disclosure.compose({
        name: `${ds.prefix}-disclosure`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
