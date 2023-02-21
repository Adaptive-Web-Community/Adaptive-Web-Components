import { FASTTreeItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./tree-item.styles.js";
import { template, TreeItemIconKeys } from "./tree-item.template.js";

export function composeTreeItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTreeItem, TreeItemIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(TreeItemIconKeys.expandCollapse)) {
            ds.statics.set(
                TreeItemIconKeys.expandCollapse,
                options.statics[TreeItemIconKeys.expandCollapse]
            );
        }
    }

    return FASTTreeItem.compose({
        name: `${ds.prefix}-tree-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}