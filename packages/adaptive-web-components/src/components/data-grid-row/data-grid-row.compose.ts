import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { DataGridRow } from "./data-grid-row.js";
import { aestheticStyles, templateStyles } from "./data-grid-row.styles.js";
import { DataGridRowAnatomy, template } from "./data-grid-row.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDataGridRow(
    ds: DesignSystem,
    options?: ComposeOptions<DataGridRow>
): Promise<FASTElementDefinition<typeof DataGridRow>> {
    const styles = ds.assembleStyles(defaultStyles, DataGridRowAnatomy, options);

    return FASTElementDefinition.compose(DataGridRow, {
        name: `${ds.prefix}-data-grid-row`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
