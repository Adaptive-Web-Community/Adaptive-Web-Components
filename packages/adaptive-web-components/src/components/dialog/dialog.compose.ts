import { FASTDialog } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./dialog.styles.js";
import { template } from "./dialog.template.js";

export function composeDialog(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDialog>
): FASTElementDefinition {
    return FASTDialog.compose({
        name: `${ds.prefix}-dialog`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}