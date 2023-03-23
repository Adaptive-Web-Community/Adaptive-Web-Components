import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveAnchor } from "./anchor.js";
import { aestheticStyles, moduleStyles, templateStyles } from "./anchor.styles.js";
import { template } from "./anchor.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles, ...moduleStyles];

export function composeAnchor(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveAnchor>
): FASTElementDefinition {
    return AdaptiveAnchor.compose({
        name: `${ds.prefix}-anchor`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}