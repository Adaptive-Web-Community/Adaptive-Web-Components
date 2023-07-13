import { ElementViewTemplate, html } from "@microsoft/fast-element";
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

/**
 * Template for sortable column header component.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<SortableColumnHeader> =
    (ds: DesignSystem) =>
    SortableColumnHeaderTemplate();

function SortableColumnHeaderTemplate<T extends SortableColumnHeader>(): ElementViewTemplate<T> {
    return html<T>`
        <template>
            <adaptive-button
                class="sort-button ${x => x.sortableColumnContext.sortBy === x.columnDefinition.columnDataKey ? 'active': ''}"
            >
                <slot></slot> 
           </adaptive-button>
        </template>
    `;
}
