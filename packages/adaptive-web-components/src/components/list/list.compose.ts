import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { List } from "./list.js";
import { aestheticStyles, templateStyles } from "./list.styles.js";
import { ListAnatomy, template } from "./list.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeList(
    ds: DesignSystem,
    options?: ComposeOptions<List>
): Promise<FASTElementDefinition<typeof List>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, ListAnatomy, options);

    return FASTElementDefinition.compose(List, {
        name: `${ds.prefix}-list`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
