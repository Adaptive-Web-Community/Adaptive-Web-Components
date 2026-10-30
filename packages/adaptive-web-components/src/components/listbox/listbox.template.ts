import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ListboxParts } from "@adaptive-web/components-foundation";
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

export { ListboxParts };

/**
 * @public
 */
export const ListboxAnatomy: ComponentAnatomy<typeof ListboxConditions, typeof ListboxParts> = {
    interactivity: controlInteractivity,
    conditions: ListboxConditions,
    parts: ListboxParts,
    focus: Focus.contextChildFocused<typeof ListboxParts>("options"),
};

/**
 * Default Listbox template: the label, which names the listbox through its `ElementInternals`, and the box of the options.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Listbox> =
    (ds: DesignSystem) => html<Listbox>`
        <span class="label" part="label" aria-hidden="true" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div class="options" part="options">
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
    `;
