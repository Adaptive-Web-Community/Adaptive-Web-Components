import { FASTAnchoredRegion } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./anchored-region.styles.js";
import { AnchoredRegionAnatomy, template } from "./anchored-region.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeAnchoredRegion(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAnchoredRegion>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, AnchoredRegionAnatomy.interactivity, options);

    return FASTAnchoredRegion.compose({
        name: `${ds.prefix}-anchored-region`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
