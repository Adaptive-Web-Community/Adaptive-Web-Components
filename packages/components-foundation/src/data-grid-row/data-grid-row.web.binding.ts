import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { DataGridRowType } from "./data-grid-row.js";
import { dataGridRowDocumentation } from "./data-grid-row.documentation.js";

/**
 * Web platform selectors and style hooks for {@link dataGridRowDocumentation}.
 *
 * @public
 */
export const dataGridRowWebBinding = {
    conditionSelectors: {
        rowType: {
            default: `[row-type='${DataGridRowType.default}'], :not([row-type])`,
            header: `[row-type='${DataGridRowType.header}']`,
            stickyHeader: `[row-type='${DataGridRowType.stickyHeader}']`,
        },
        selected: "[selected]",
    },
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof dataGridRowDocumentation>;
