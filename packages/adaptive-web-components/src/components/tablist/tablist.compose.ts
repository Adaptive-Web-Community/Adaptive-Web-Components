import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Tablist } from "./tablist.js";
import { aestheticStyles, templateStyles } from "./tablist.styles.js";
import { TablistAnatomy, template } from "./tablist.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTablist(
    ds: DesignSystem,
    options?: ComposeOptions<Tablist>
): Promise<FASTElementDefinition<typeof Tablist>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, TablistAnatomy, options);

    return FASTElementDefinition.compose(Tablist, {
        name: `${ds.prefix}-tablist`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
