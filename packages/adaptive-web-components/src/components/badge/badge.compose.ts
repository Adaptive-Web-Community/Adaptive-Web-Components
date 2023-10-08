import { FASTBadge } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./badge.styles.js";
import { BadgeAnatomy, template } from "./badge.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeBadge(
    ds: DesignSystem,
    options?: ComposeOptions<FASTBadge>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, BadgeAnatomy.interactivity, options);

    return FASTBadge.compose({
        name: `${ds.prefix}-badge`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
