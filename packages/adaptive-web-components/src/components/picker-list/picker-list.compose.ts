import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./picker-list.styles.js";
import { PickerListAnatomy, template } from "./picker-list.template.js";
import { PickerList } from "./picker-list.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePickerList(
    ds: DesignSystem,
    options?: ComposeOptions<PickerList>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, PickerListAnatomy, options);

    return PickerList.compose({
        name: `${ds.prefix}-picker-list`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
