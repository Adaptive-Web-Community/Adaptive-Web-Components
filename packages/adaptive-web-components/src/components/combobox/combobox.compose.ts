import { FASTCombobox } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./combobox.styles.js";
import { ComboboxStatics, template } from "./combobox.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

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