import { FASTProgress } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./progress.styles.js";
import { template } from "./progress.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeProgress(
    ds: DesignSystem,
    options?: ComposeOptions<FASTProgress>
): FASTElementDefinition {
    return FASTProgress.compose({
        name: `${ds.prefix}-progress`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}