import { FASTTooltip } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tooltip.styles.js";
import { template } from "./tooltip.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTooltip(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTooltip>
): FASTElementDefinition {
    return FASTTooltip.compose({
        name: `${ds.prefix}-tooltip`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}