import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
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
    const styles = DesignSystem.assembleStyles(defaultStyles, HorizontalScrollAnatomy, options);

    return AdaptiveHorizontalScroll.compose({
        name: `${ds.prefix}-horizontal-scroll`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
