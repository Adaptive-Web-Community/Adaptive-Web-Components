import { FASTDataGrid } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./data-grid.styles.js";
import { template } from "./data-grid.template.js";

export function composeDataGrid(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDataGrid>
): FASTElementDefinition {
    return FASTDataGrid.compose({
        name: `${ds.prefix}-data-grid`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}