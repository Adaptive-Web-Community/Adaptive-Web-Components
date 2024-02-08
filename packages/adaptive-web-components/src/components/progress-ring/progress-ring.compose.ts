import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./progress-ring.styles.js";
import { ProgressRingAnatomy, template } from "./progress-ring.template.js";
import { ProgressRing } from "./progress-ring.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeProgressRing(
    ds: DesignSystem,
    options?: ComposeOptions<ProgressRing>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, ProgressRingAnatomy, options);

    return ProgressRing.compose({
        name: `${ds.prefix}-progress-ring`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
