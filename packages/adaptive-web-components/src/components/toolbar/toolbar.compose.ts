import { FASTToolbar } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./toolbar.styles.js";
import { template, ToolbarAnatomy } from "./toolbar.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeToolbar(
    ds: DesignSystem,
    options?: ComposeOptions<FASTToolbar>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, ToolbarAnatomy, options);

    return FASTToolbar.compose({
        name: `${ds.prefix}-toolbar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
