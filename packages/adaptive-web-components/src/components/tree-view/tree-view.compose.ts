import { FASTTreeView } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tree-view.styles.js";
import { template } from "./tree-view.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

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