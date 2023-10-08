import { FASTDataGridRow } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./data-grid-row.styles.js";
import { DataGridRowAnatomy, template } from "./data-grid-row.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDataGridRow(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDataGridRow>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DataGridRowAnatomy.interactivity, options);

    return FASTDataGridRow.compose({
        name: `${ds.prefix}-data-grid-row`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
