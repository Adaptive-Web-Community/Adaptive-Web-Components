import { FASTTreeItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tree-item.styles.js";
import { template, TreeItemStatics } from "./tree-item.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

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

    return FASTTreeItem.compose({
        name: `${ds.prefix}-tree-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}