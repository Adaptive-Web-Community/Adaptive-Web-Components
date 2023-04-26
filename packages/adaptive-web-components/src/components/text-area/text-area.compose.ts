import { FASTTextArea } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./text-area.styles.js";
import { template, TextAreaAnatomy } from "./text-area.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTextArea(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTextArea>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, TextAreaAnatomy.interactivity, options);

    return FASTTextArea.compose({
        name: `${ds.prefix}-text-area`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
