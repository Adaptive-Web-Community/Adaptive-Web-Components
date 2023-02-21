import { FASTRadio } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./radio.styles.js";
import { RadioIconKeys, template } from "./radio.template.js";

export function composeRadio(
    ds: DesignSystem,
    options?: ComposeOptions<FASTRadio, RadioIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(RadioIconKeys.checked)) {
            ds.statics.set(
                RadioIconKeys.checked,
                options.statics[RadioIconKeys.checked]
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