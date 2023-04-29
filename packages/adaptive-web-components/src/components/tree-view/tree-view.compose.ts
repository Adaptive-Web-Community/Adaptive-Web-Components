import { FASTTreeView } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tree-view.styles.js";
import { template, TreeViewAnatomy } from "./tree-view.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTreeView(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTreeView>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, TreeViewAnatomy.interactivity, options);

    return FASTTreeView.compose({
        name: `${ds.prefix}-tree-view`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
