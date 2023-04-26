import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveButton } from "./button.js";
import { aestheticStyles, templateStyles } from "./button.styles.js";
import { ButtonAnatomy, template } from "./button.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeButton(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveButton>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, ButtonAnatomy.interactivity, options);

    return AdaptiveButton.compose({
        name: `${ds.prefix}-button`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
