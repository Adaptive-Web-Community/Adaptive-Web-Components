import { FASTDivider } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./divider.styles.js";
import { template } from "./divider.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeDivider(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDivider>
): FASTElementDefinition {
    return FASTDivider.compose({
        name: `${ds.prefix}-divider`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}