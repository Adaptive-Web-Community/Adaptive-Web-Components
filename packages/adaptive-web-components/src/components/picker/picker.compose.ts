import { FASTPicker } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./picker.styles.js";
import { template } from "./picker.template.js";

export function composePicker(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPicker>
): FASTElementDefinition {
    return FASTPicker.compose({
        name: `${ds.prefix}-picker`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}