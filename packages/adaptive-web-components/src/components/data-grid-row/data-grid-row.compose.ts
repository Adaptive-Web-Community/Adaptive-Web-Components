import { FASTDataGridRow } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./data-grid-row.styles.js";
import { template } from "./data-grid-row.template.js";

export function composeDataGridRow(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDataGridRow>
): FASTElementDefinition {
    return FASTDataGridRow.compose({
        name: `${ds.prefix}-data-grid-row`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}