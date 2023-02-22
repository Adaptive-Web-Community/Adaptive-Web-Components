import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveButton } from "./button.js";
import { aestheticStyles, templateStyles } from "./button.styles.js";
import { template } from "./button.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeButton(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveButton>
): FASTElementDefinition {
    return AdaptiveButton.compose({
        name: `${ds.prefix}-button`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}