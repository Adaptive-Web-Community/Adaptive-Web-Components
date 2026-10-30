import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from '../../styles/styles.js';
import { TreeItem } from "./tree-item.js";
import { aestheticStyles, templateStyles } from "./tree-item.styles.js";
import { template, TreeItemAnatomy, TreeItemStatics } from "./tree-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeTreeItem(
    ds: DesignSystem,
    options?: ComposeOptions<TreeItem, TreeItemStatics>
): Promise<FASTElementDefinition<typeof TreeItem>> {
    if (options?.statics) {
        if (!ds.statics.has(TreeItemStatics.expandCollapse)) {
            ds.statics.set(
                TreeItemStatics.expandCollapse,
                options.statics[TreeItemStatics.expandCollapse]
            );
        }
    }

    const styles = ds.assembleStyles(defaultStyles, TreeItemAnatomy, options);

    return FASTElementDefinition.compose(TreeItem, {
        name: `${ds.prefix}-tree-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
