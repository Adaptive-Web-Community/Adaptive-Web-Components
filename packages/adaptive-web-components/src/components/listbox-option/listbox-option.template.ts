import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { ListboxOptionParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ListboxOption } from "./listbox-option.js";

/**
 * @public
 */
export const ListboxOptionConditions = {
    selected: ":state(selected)",
    active: ":state(active)",
};

export { ListboxOptionParts };

/**
 * @public
 */
export const ListboxOptionAnatomy: ComponentAnatomy<typeof ListboxOptionConditions, typeof ListboxOptionParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ListboxOptionConditions,
    parts: ListboxOptionParts,
};

/**
 * Default Listbox Option template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<ListboxOption> =
    (ds: DesignSystem) => html<ListboxOption>`
        <slot name="start"></slot>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <slot name="end"></slot>
    `;
