import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./toolbar.styles.js";
import { template, ToolbarAnatomy } from "./toolbar.template.js";
import { Toolbar } from "./toolbar.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeToolbar(
    ds: DesignSystem,
    options?: ComposeOptions<Toolbar>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, ToolbarAnatomy, options);

    return Toolbar.compose({
        name: `${ds.prefix}-toolbar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
