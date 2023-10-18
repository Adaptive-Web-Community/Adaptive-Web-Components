import { FASTTreeItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tree-item.styles.js";
import { template, TreeItemAnatomy, TreeItemStatics } from "./tree-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTreeItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTreeItem, TreeItemStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(TreeItemStatics.expandCollapse)) {
            ds.statics.set(
                TreeItemStatics.expandCollapse,
                options.statics[TreeItemStatics.expandCollapse]
            );
        }
    }

    const styles = DesignSystem.assembleStyles(defaultStyles, TreeItemAnatomy, options);

    return FASTTreeItem.compose({
        name: `${ds.prefix}-tree-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
