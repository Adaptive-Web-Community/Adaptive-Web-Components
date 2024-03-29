import { FASTCombobox } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from "../../styles/styles.js";
import { AdaptiveCombobox } from "./combobox.js";
import { aestheticStyles, templateStyles } from "./combobox.styles.js";
import { ComboboxAnatomy, ComboboxStatics, template } from "./combobox.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

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

    const styles = DesignSystem.assembleStyles(defaultStyles, ComboboxAnatomy, options);

    return AdaptiveCombobox.compose({
        name: `${ds.prefix}-combobox`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
