import { FASTTabs } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tabs.styles.js";
import { TabsAnatomy, template } from "./tabs.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTabs(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTabs>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, TabsAnatomy.interactivity, options);

    return FASTTabs.compose({
        name: `${ds.prefix}-tabs`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
