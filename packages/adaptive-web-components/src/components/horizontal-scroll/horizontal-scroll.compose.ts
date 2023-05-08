import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./horizontal-scroll.styles.js";
import { HorizontalScrollAnatomy, template } from "./horizontal-scroll.template.js";
import { AdaptiveHorizontalScroll } from "./horizontal-scroll.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeHorizontalScroll(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveHorizontalScroll>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, HorizontalScrollAnatomy.interactivity, options);

    return AdaptiveHorizontalScroll.compose({
        name: `${ds.prefix}-horizontal-scroll`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
