import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./anchored-region.styles.js";
import { AnchoredRegionAnatomy, template } from "./anchored-region.template.js";
import { AnchoredRegion } from "./anchored-region.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeAnchoredRegion(
    ds: DesignSystem,
    options?: ComposeOptions<AnchoredRegion>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, AnchoredRegionAnatomy, options);

    return AnchoredRegion.compose({
        name: `${ds.prefix}-anchored-region`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
