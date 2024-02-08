import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./badge.styles.js";
import { BadgeAnatomy, template } from "./badge.template.js";
import { Badge } from "./badge.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeBadge(
    ds: DesignSystem,
    options?: ComposeOptions<Badge>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, BadgeAnatomy, options);

    return Badge.compose({
        name: `${ds.prefix}-badge`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
