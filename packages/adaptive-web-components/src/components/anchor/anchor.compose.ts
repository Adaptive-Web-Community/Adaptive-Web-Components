import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveAnchor } from "./anchor.js";
import { aestheticStyles, templateStyles } from "./anchor.styles.js";
import { AnchorAnatomy, template } from "./anchor.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeAnchor(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveAnchor>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, AnchorAnatomy.interactivity, options);

    return AdaptiveAnchor.compose({
        name: `${ds.prefix}-anchor`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
