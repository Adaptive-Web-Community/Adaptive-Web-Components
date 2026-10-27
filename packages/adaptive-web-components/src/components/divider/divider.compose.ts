import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Divider } from "./divider.js";
import { aestheticStyles, templateStyles } from "./divider.styles.js";
import { DividerAnatomy, template } from "./divider.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDivider(
    ds: DesignSystem,
    options?: ComposeOptions<Divider>
): Promise<FASTElementDefinition<typeof Divider>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, DividerAnatomy, options);

    return FASTElementDefinition.compose(Divider, {
        name: `${ds.prefix}-divider`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
