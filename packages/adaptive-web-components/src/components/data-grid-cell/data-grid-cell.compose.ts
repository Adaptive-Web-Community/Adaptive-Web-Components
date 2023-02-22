import { FASTDataGridCell } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./data-grid-cell.styles.js";
import { template } from "./data-grid-cell.template.js";

export function composeDataGridCell(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDataGridCell>
): FASTElementDefinition {
    return FASTDataGridCell.compose({
        name: `${ds.prefix}-data-grid-cell`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}