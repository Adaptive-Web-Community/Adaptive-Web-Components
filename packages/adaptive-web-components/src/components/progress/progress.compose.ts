import { FASTProgress } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./progress.styles.js";
import { ProgressAnatomy, template } from "./progress.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeProgress(
    ds: DesignSystem,
    options?: ComposeOptions<FASTProgress>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, ProgressAnatomy, options);

    return FASTProgress.compose({
        name: `${ds.prefix}-progress`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
