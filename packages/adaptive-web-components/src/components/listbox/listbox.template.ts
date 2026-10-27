import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import type { Listbox } from "./listbox.js";

/**
 * @public
 */
export const ListboxConditions = {
    multiple: "[multiple]",
    readOnly: "[readonly]",
};

/**
 * @public
 */
export const ListboxParts = {
};

/**
 * @public
 */
export const ListboxAnatomy: ComponentAnatomy<typeof ListboxConditions, typeof ListboxParts> = {
    interactivity: controlInteractivity,
    conditions: ListboxConditions,
    parts: ListboxParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Listbox template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Listbox> =
    (ds: DesignSystem) => html<Listbox>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
