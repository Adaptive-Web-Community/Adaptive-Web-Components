import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { RadioGroup } from "./radio-group.js";
import { aestheticStyles, templateStyles } from "./radio-group.styles.js";
import { RadioGroupAnatomy, template } from "./radio-group.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeRadioGroup(
    ds: DesignSystem,
    options?: ComposeOptions<RadioGroup>
): Promise<FASTElementDefinition<typeof RadioGroup>> {
    const styles = ds.assembleStyles(defaultStyles, RadioGroupAnatomy, options);

    return FASTElementDefinition.compose(RadioGroup, {
        name: `${ds.prefix}-radio-group`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
