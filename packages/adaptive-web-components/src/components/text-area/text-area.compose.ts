import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { TextArea } from "./text-area.js";
import { aestheticStyles, templateStyles } from "./text-area.styles.js";
import { template, TextAreaAnatomy } from "./text-area.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeTextArea(
    ds: DesignSystem,
    options?: ComposeOptions<TextArea>
): Promise<FASTElementDefinition<typeof TextArea>> {
    const styles = ds.assembleStyles(defaultStyles, TextAreaAnatomy, options);

    return FASTElementDefinition.compose(TextArea, {
        name: `${ds.prefix}-text-area`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
