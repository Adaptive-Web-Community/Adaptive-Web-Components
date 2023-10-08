import { FASTDivider } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./divider.styles.js";
import { DividerAnatomy, template } from "./divider.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDivider(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDivider>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DividerAnatomy.interactivity, options);

    return FASTDivider.compose({
        name: `${ds.prefix}-divider`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
