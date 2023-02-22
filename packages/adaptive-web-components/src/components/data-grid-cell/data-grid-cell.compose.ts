import { FASTDataGridCell } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./data-grid-cell.styles.js";
import { template } from "./data-grid-cell.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

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