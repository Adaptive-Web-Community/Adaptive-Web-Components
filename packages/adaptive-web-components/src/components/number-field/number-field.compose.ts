import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from '../../styles/styles.js';
import { NumberField } from "./number-field.js";
import { aestheticStyles, templateStyles } from "./number-field.styles.js";
import { NumberFieldAnatomy, NumberFieldStatics, template } from "./number-field.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeNumberField(
    ds: DesignSystem,
    options?: ComposeOptions<NumberField, NumberFieldStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(NumberFieldStatics.stepDown)) {
            ds.statics.set(
                NumberFieldStatics.stepDown,
                options.statics[NumberFieldStatics.stepDown]
            );
        }

        if (!ds.statics.has(NumberFieldStatics.stepUp)) {
            ds.statics.set(
                NumberFieldStatics.stepUp,
                options.statics[NumberFieldStatics.stepUp]
            );
        }
    }

    const styles = DesignSystem.assembleStyles(defaultStyles, NumberFieldAnatomy, options);

    return NumberField.compose({
        name: `${ds.prefix}-number-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
