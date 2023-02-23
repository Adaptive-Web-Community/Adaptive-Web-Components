import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tooltip.styles.js";
import { template } from "./tooltip.template.js";
import { AdaptiveTooltip } from './tooltip.js';

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTooltip(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveTooltip>
): FASTElementDefinition {
    // TODO: switch back to FASTTooltip after https://github.com/microsoft/fast/pull/6649 is merged and published.
    return AdaptiveTooltip.compose({
        name: `${ds.prefix}-tooltip`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}