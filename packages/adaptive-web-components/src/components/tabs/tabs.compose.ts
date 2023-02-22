import { FASTTabs } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tabs.styles.js";
import { template } from "./tabs.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTabs(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTabs>
): FASTElementDefinition {
    return FASTTabs.compose({
        name: `${ds.prefix}-tabs`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}