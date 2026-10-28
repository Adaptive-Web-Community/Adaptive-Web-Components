import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { DataGrid } from "./data-grid.js";
import { aestheticStyles, templateStyles } from "./data-grid.styles.js";
import { DataGridAnatomy, template } from "./data-grid.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDataGrid(
    ds: DesignSystem,
    options?: ComposeOptions<DataGrid>
): Promise<FASTElementDefinition<typeof DataGrid>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, DataGridAnatomy, options);

    return FASTElementDefinition.compose(DataGrid, {
        name: `${ds.prefix}-data-grid`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
