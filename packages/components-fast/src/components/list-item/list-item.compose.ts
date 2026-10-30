import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { ListItem } from "./list-item.js";
import { aestheticStyles, templateStyles } from "./list-item.styles.js";
import { ListItemAnatomy, template } from "./list-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeListItem(
    ds: DesignSystem,
    options?: ComposeOptions<ListItem>
): Promise<FASTElementDefinition<typeof ListItem>> {
    const styles = ds.assembleStyles(defaultStyles, ListItemAnatomy, options);

    return FASTElementDefinition.compose(ListItem, {
        name: `${ds.prefix}-list-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
