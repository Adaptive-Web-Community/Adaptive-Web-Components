import { FASTTab } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tab.styles.js";
import { TabAnatomy, template } from "./tab.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTab(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTab>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, TabAnatomy, options);

    return FASTTab.compose({
        name: `${ds.prefix}-tab`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
