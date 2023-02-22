import { FASTTextArea } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./text-area.styles.js";
import { template } from "./text-area.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTextArea(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTextArea>
): FASTElementDefinition {
    return FASTTextArea.compose({
        name: `${ds.prefix}-text-area`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}