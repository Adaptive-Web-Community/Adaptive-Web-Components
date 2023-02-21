import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./horizontal-scroll.styles.js";
import { template } from "./horizontal-scroll.template.js";
import { AdaptiveHorizontalScroll } from "./horizontal-scroll.js";

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