import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Toolbar } from "./toolbar.js";
import { aestheticStyles, templateStyles } from "./toolbar.styles.js";
import { template, ToolbarAnatomy } from "./toolbar.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeToolbar(
    ds: DesignSystem,
    options?: ComposeOptions<Toolbar>
): Promise<FASTElementDefinition<typeof Toolbar>> {
    const styles = ds.assembleStyles(defaultStyles, ToolbarAnatomy, options);

    return FASTElementDefinition.compose(Toolbar, {
        name: `${ds.prefix}-toolbar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
