import { FASTNumberField } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./number-field.styles.js";
import { NumberFieldStatics, template } from "./number-field.template.js";

export function composeNumberField(
    ds: DesignSystem,
    options?: ComposeOptions<FASTNumberField, NumberFieldStatics>
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

    return FASTNumberField.compose({
        name: `${ds.prefix}-number-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}