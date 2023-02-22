import { FASTAnchoredRegion } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./anchored-region.styles.js";
import { template } from "./anchored-region.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeAnchoredRegion(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAnchoredRegion>
): FASTElementDefinition {
    return FASTAnchoredRegion.compose({
        name: `${ds.prefix}-anchored-region`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}