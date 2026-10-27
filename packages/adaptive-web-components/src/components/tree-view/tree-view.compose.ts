import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { TreeView } from "./tree-view.js";
import { aestheticStyles, templateStyles } from "./tree-view.styles.js";
import { template, TreeViewAnatomy } from "./tree-view.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTreeView(
    ds: DesignSystem,
    options?: ComposeOptions<TreeView>
): Promise<FASTElementDefinition<typeof TreeView>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, TreeViewAnatomy, options);

    return FASTElementDefinition.compose(TreeView, {
        name: `${ds.prefix}-tree-view`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
