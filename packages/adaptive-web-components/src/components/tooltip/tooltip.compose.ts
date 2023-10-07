import { FASTTooltip } from '@microsoft/fast-foundation';
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tooltip.styles.js";
import { template, TooltipAnatomy } from "./tooltip.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTooltip(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTooltip>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, TooltipAnatomy.interactivity, options);

    return FASTTooltip.compose({
        name: `${ds.prefix}-tooltip`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
