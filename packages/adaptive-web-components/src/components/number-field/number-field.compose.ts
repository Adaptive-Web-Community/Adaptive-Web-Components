import { FASTNumberField } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./number-field.styles.js";
import { NumberFieldAnatomy, NumberFieldStatics, template } from "./number-field.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
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

    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, NumberFieldAnatomy.interactivity, options);

    return FASTNumberField.compose({
        name: `${ds.prefix}-number-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
