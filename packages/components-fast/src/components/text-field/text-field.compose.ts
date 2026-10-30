import { FASTElementDefinition } from "@microsoft/fast-element";
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
): Promise<FASTElementDefinition<typeof TextField>> {
    const styles = ds.assembleStyles(defaultStyles, TextFieldAnatomy, options);

    return FASTElementDefinition.compose(TextField, {
        name: `${ds.prefix}-text-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
