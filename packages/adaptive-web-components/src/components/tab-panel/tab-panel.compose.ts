import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./tab-panel.styles.js";
import { TabPanelAnatomy, template } from "./tab-panel.template.js";
import { TabPanel } from "./tab-panel.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTabPanel(
    ds: DesignSystem,
    options?: ComposeOptions<TabPanel>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, TabPanelAnatomy, options);

    return TabPanel.compose({
        name: `${ds.prefix}-tab-panel`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
