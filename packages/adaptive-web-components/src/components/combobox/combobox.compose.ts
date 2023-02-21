import { FASTCombobox } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./combobox.styles.js";
import { ComboboxIconKeys, template } from "./combobox.template.js";

export function composeCombobox(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCombobox, ComboboxIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(ComboboxIconKeys.indicator)) {
            ds.statics.set(
                ComboboxIconKeys.indicator,
                options.statics[ComboboxIconKeys.indicator]
            );
        }
    }

    return FASTCombobox.compose({
        name: `${ds.prefix}-combobox`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}