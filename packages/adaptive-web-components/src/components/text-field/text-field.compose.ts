import { FASTTextField } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveTextField } from "./text-field.js";
import { aestheticStyles, templateStyles } from "./text-field.styles.js";
import { template, TextFieldAnatomy } from "./text-field.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTextField(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTextField>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, TextFieldAnatomy, options);

    return AdaptiveTextField.compose({
        name: `${ds.prefix}-text-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
