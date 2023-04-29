import { FASTTabPanel } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tab-panel.styles.js";
import { TabPanelAnatomy, template } from "./tab-panel.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTabPanel(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTabPanel>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, TabPanelAnatomy.interactivity, options);

    return FASTTabPanel.compose({
        name: `${ds.prefix}-tab-panel`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
