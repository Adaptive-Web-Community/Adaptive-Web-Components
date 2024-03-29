import { FASTTabs } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./tabs.styles.js";
import { TabsAnatomy, template } from "./tabs.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTabs(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTabs>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, TabsAnatomy, options);

    return FASTTabs.compose({
        name: `${ds.prefix}-tabs`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
