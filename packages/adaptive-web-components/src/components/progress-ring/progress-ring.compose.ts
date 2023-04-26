import { FASTProgressRing } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./progress-ring.styles.js";
import { ProgressRingAnatomy, template } from "./progress-ring.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeProgressRing(
    ds: DesignSystem,
    options?: ComposeOptions<FASTProgressRing>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, ProgressRingAnatomy.interactivity, options);

    return FASTProgressRing.compose({
        name: `${ds.prefix}-progress-ring`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
