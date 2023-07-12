import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { ColumnDefinition, DataGridSelectionMode, FASTDataGridCell } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { SortableColumnHeader } from "./sortable-column-header.js"

/**
 * @public
 */
export const SortableColumnHeaderConditions = {
};

/**
 * @public
 */
export const SortableColumnHeaderParts = {
};

/**
 * @public
 */
export const SortableColumnHeaderAnatomy: ComponentAnatomy<typeof SortableColumnHeaderConditions, typeof SortableColumnHeaderParts> = {
    interactivity: Interactivity.never,
    conditions: SortableColumnHeaderConditions,
    parts: SortableColumnHeaderParts,
};

// export const headerSortCellTemplate = html<FASTDataGridCell>`
// <template>
//     <adaptive-button
//       class="header-sort-button"
//       @click="${(x) => x.$emit('updatesort', x.columnDefinition)}"
//     >
//         ${ x => x.columnDefinition?.title }
//     </adaptive-button>
//   </template>
// `;

// function getFocusTarget(cell: FASTDataGridCell): HTMLElement {
//     return cell.children[0] as HTMLElement;
// }

/**
 * Template for sortable column header component.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<SortableColumnHeader> =
    (ds: DesignSystem) =>
    SortableColumnHeaderTemplate();

function SortableColumnHeaderTemplate<T extends SortableColumnHeader>(): ElementViewTemplate<T> {
    return html`
        <template>
        <adaptive-button
            class="header-sort-button"
        >
            ${ x => x.columnDefinition?.title }
           </adaptive-button>
        </template>
    `;
}
