import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from "../../styles/styles.js";
import { Picker } from "./picker.js";
import { aestheticStyles, templateStyles } from "./picker.styles.js";
import { PickerAnatomy, PickerStatics, template } from "./picker.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composePicker(
    ds: DesignSystem,
    options?: ComposeOptions<Picker, PickerStatics>
): Promise<FASTElementDefinition<typeof Picker>> {
    if (options?.statics) {
        if (!ds.statics.has(PickerStatics.indicator)) {
            ds.statics.set(
                PickerStatics.indicator,
                options.statics[PickerStatics.indicator]
            );
        }
        if (!ds.statics.has(PickerStatics.removeValue)) {
            ds.statics.set(
                PickerStatics.removeValue,
                options.statics[PickerStatics.removeValue]
            );
        }
    }

    const styles = ds.assembleStyles(defaultStyles, PickerAnatomy, options);

    return FASTElementDefinition.compose(Picker, {
        name: `${ds.prefix}-picker`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
