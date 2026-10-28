import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { DataGridCell } from "./data-grid-cell.js";
import { aestheticStyles, templateStyles } from "./data-grid-cell.styles.js";
import { DataGridCellAnatomy, template } from "./data-grid-cell.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDataGridCell(
    ds: DesignSystem,
    options?: ComposeOptions<DataGridCell>
): Promise<FASTElementDefinition<typeof DataGridCell>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, DataGridCellAnatomy, options);

    return FASTElementDefinition.compose(DataGridCell, {
        name: `${ds.prefix}-data-grid-cell`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
