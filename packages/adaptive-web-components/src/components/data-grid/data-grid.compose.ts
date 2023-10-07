import { FASTDataGrid } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./data-grid.styles.js";
import { DataGridAnatomy, template } from "./data-grid.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDataGrid(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDataGrid>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DataGridAnatomy.interactivity, options);

    return FASTDataGrid.compose({
        name: `${ds.prefix}-data-grid`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
