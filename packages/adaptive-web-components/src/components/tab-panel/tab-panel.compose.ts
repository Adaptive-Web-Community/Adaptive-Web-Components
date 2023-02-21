import { FASTTabPanel } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./tab-panel.styles.js";
import { template } from "./tab-panel.template.js";

export function composeTabPanel(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTabPanel>
): FASTElementDefinition {
    return FASTTabPanel.compose({
        name: `${ds.prefix}-tab-panel`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}