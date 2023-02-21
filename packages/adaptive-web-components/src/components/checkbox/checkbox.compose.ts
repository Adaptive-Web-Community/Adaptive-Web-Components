import { FASTCheckbox } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./checkbox.styles.js";
import { CheckboxIconKeys, template } from "./checkbox.template.js";

export function composeCheckbox(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCheckbox, CheckboxIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(CheckboxIconKeys.checked)) {
            ds.statics.set(
                CheckboxIconKeys.checked,
                options.statics[CheckboxIconKeys.checked]
            );
        }

        if (!ds.statics.has(CheckboxIconKeys.indeterminate)) {
            ds.statics.set(
                CheckboxIconKeys.indeterminate,
                options.statics[CheckboxIconKeys.indeterminate]
            );
        }
    }

    return FASTCheckbox.compose({
        name: `${ds.prefix}-checkbox`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}