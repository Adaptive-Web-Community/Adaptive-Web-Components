import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./radio-group.styles.js";
import { RadioGroupAnatomy, template } from "./radio-group.template.js";
import { RadioGroup } from "./radio-group.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeRadioGroup(
    ds: DesignSystem,
    options?: ComposeOptions<RadioGroup>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, RadioGroupAnatomy, options);

    return RadioGroup.compose({
        name: `${ds.prefix}-radio-group`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
