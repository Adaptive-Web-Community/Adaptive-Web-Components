import { FASTDataGridCell } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./data-grid-cell.styles.js";
import { DataGridCellAnatomy, template } from "./data-grid-cell.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDataGridCell(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDataGridCell>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DataGridCellAnatomy.interactivity, options);

    return FASTDataGridCell.compose({
        name: `${ds.prefix}-data-grid-cell`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
