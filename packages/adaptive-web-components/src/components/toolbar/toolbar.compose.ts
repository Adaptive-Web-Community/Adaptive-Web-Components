import { FASTToolbar } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./toolbar.styles.js";
import { template } from "./toolbar.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeToolbar(
    ds: DesignSystem,
    options?: ComposeOptions<FASTToolbar>
): FASTElementDefinition {
    return FASTToolbar.compose({
        name: `${ds.prefix}-toolbar`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}