import { FASTTextArea } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveTextArea } from "./text-area.js";
import { aestheticStyles, templateStyles } from "./text-area.styles.js";
import { template, TextAreaAnatomy } from "./text-area.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTextArea(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTextArea>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, TextAreaAnatomy, options);

    return AdaptiveTextArea.compose({
        name: `${ds.prefix}-text-area`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
