import { FASTRadio } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./radio.styles.js";
import { RadioStatics, template } from "./radio.template.js";

export function composeRadio(
    ds: DesignSystem,
    options?: ComposeOptions<FASTRadio, RadioStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(RadioStatics.checked)) {
            ds.statics.set(
                RadioStatics.checked,
                options.statics[RadioStatics.checked]
            );
        }
    }

    return FASTRadio.compose({
        name: `${ds.prefix}-radio`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}