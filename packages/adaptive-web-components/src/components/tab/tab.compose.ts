import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Tab } from "./tab.js";
import { aestheticStyles, templateStyles } from "./tab.styles.js";
import { TabAnatomy, template } from "./tab.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTab(
    ds: DesignSystem,
    options?: ComposeOptions<Tab>
): Promise<FASTElementDefinition<typeof Tab>> {
    const styles = ds.assembleStyles(defaultStyles, TabAnatomy, options);

    return FASTElementDefinition.compose(Tab, {
        name: `${ds.prefix}-tab`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
