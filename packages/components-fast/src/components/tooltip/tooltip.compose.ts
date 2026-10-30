import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Tooltip } from "./tooltip.js";
import { aestheticStyles, templateStyles } from "./tooltip.styles.js";
import { template, TooltipAnatomy } from "./tooltip.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTooltip(
    ds: DesignSystem,
    options?: ComposeOptions<Tooltip>
): Promise<FASTElementDefinition<typeof Tooltip>> {
    const styles = ds.assembleStyles(defaultStyles, TooltipAnatomy, options);

    return FASTElementDefinition.compose(Tooltip, {
        name: `${ds.prefix}-tooltip`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
