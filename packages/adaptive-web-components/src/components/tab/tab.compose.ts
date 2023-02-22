import { FASTTab } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./tab.styles.js";
import { template } from "./tab.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTab(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTab>
): FASTElementDefinition {
    return FASTTab.compose({
        name: `${ds.prefix}-tab`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}