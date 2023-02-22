import { FASTCombobox } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./combobox.styles.js";
import { ComboboxStatics, template } from "./combobox.template.js";

export function composeCombobox(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCombobox, ComboboxStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(ComboboxStatics.indicator)) {
            ds.statics.set(
                ComboboxStatics.indicator,
                options.statics[ComboboxStatics.indicator]
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