import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { TabPanel } from "./tab-panel.js";
import { aestheticStyles, templateStyles } from "./tab-panel.styles.js";
import { TabPanelAnatomy, template } from "./tab-panel.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTabPanel(
    ds: DesignSystem,
    options?: ComposeOptions<TabPanel>
): Promise<FASTElementDefinition<typeof TabPanel>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, TabPanelAnatomy, options);

    return FASTElementDefinition.compose(TabPanel, {
        name: `${ds.prefix}-tab-panel`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
