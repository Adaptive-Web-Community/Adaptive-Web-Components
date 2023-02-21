import { FASTNumberField } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./number-field.styles.js";
import { NumberFieldIconKeys, template } from "./number-field.template.js";

export function composeNumberField(
    ds: DesignSystem,
    options?: ComposeOptions<FASTNumberField, NumberFieldIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(NumberFieldIconKeys.stepDown)) {
            ds.statics.set(
                NumberFieldIconKeys.stepDown,
                options.statics[NumberFieldIconKeys.stepDown]
            );
        }

        if (!ds.statics.has(NumberFieldIconKeys.stepUp)) {
            ds.statics.set(
                NumberFieldIconKeys.stepUp,
                options.statics[NumberFieldIconKeys.stepUp]
            );
        }
    }

    return FASTNumberField.compose({
        name: `${ds.prefix}-number-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}