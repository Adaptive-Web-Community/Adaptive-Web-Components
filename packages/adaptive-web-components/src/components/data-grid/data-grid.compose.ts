import { FASTDataGrid } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./data-grid.styles.js";
import { template } from "./data-grid.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

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