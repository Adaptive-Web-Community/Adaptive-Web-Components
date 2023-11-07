import { FASTPicker } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./picker.styles.js";
import { PickerAnatomy, template } from "./picker.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePicker(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPicker>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, PickerAnatomy, options);

    return FASTPicker.compose({
        name: `${ds.prefix}-picker`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
