import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./horizontal-scroll.styles.js";
import { template } from "./horizontal-scroll.template.js";
import { AdaptiveHorizontalScroll } from "./horizontal-scroll.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeHorizontalScroll(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveHorizontalScroll>
): FASTElementDefinition {
    return AdaptiveHorizontalScroll.compose({
        name: `${ds.prefix}-horizontal-scroll`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}