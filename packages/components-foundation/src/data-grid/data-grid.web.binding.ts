import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { DataGridSelectionMode } from "./data-grid.js";
import { dataGridDocumentation } from "./data-grid.documentation.js";

/**
 * Web platform selectors and style hooks for {@link dataGridDocumentation}.
 *
 * @public
 */
export const dataGridWebBinding = {
    conditionSelectors: {
        selectionMode: {
            none: ':is(:not([selection-mode]), [selection-mode="none"])',
            singleRow: `[selection-mode="${DataGridSelectionMode.singleRow}"]`,
            multiRow: `[selection-mode="${DataGridSelectionMode.multiRow}"]`,
        },
    },
    partSelectors: {
        rows: ".rows",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof dataGridDocumentation>;
