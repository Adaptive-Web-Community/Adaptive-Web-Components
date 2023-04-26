import { FASTPickerList } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker-list.styles.js";
import { PickerListAnatomy, template } from "./picker-list.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composePickerList(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerList>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, PickerListAnatomy.interactivity, options);

    return FASTPickerList.compose({
        name: `${ds.prefix}-picker-list`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
