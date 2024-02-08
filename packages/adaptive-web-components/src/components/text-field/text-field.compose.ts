import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { TextField } from "./text-field.js";
import { aestheticStyles, templateStyles } from "./text-field.styles.js";
import { template, TextFieldAnatomy } from "./text-field.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTextField(
    ds: DesignSystem,
    options?: ComposeOptions<TextField>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, TextFieldAnatomy, options);

    return TextField.compose({
        name: `${ds.prefix}-text-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
