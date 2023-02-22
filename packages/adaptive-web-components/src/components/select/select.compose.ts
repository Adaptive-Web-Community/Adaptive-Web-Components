import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveSelect } from "./select.js";
import { styles } from "./select.styles.js";
import { SelectStatics, template } from "./select.template.js";

export function composeSelect(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveSelect, SelectStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(SelectStatics.indicator)) {
            ds.statics.set(
                SelectStatics.indicator,
                options.statics[SelectStatics.indicator]
            );
        }
    }

    return AdaptiveSelect.compose({
        name: `${ds.prefix}-select`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}