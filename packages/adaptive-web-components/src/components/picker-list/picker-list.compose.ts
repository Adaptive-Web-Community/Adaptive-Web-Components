import { FASTPickerList } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker-list.styles.js";
import { template } from "./picker-list.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composePickerList(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerList>
): FASTElementDefinition {
    return FASTPickerList.compose({
        name: `${ds.prefix}-picker-list`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}