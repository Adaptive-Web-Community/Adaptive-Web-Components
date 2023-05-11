import { FASTCombobox } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./combobox.styles.js";
import { ComboboxAnatomy, ComboboxStatics, template } from "./combobox.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
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

    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, ComboboxAnatomy.interactivity, options);

    return FASTCombobox.compose({
        name: `${ds.prefix}-combobox`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
