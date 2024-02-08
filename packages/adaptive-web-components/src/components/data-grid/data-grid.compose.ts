import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./data-grid.styles.js";
import { DataGridAnatomy, template } from "./data-grid.template.js";
import { DataGrid } from "./data-grid.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDataGrid(
    ds: DesignSystem,
    options?: ComposeOptions<DataGrid>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DataGridAnatomy, options);

    return DataGrid.compose({
        name: `${ds.prefix}-data-grid`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
