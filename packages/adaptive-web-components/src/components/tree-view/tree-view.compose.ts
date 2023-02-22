import { FASTTreeView } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./tree-view.styles.js";
import { template } from "./tree-view.template.js";

export function composeTreeView(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTreeView>
): FASTElementDefinition {
    return FASTTreeView.compose({
        name: `${ds.prefix}-tree-view`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}