import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { listboxDocumentation, ListboxParts, ListboxSlots, listboxWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Listbox } from "./listbox.js";

/**
 * @public
 */
export const ListboxAnatomy = documentationToComponentAnatomy(listboxDocumentation, listboxWebBinding);

/**
 * Default Listbox template: the label, which names the listbox through its `ElementInternals`, and the box of the options.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Listbox> =
    (ds: DesignSystem) => html<Listbox>`
        <span class=${(_) => ListboxParts.label} part=${(_) => ListboxParts.label} aria-hidden="true" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => ListboxSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div class=${(_) => ListboxParts.options} part=${(_) => ListboxParts.options}>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
    `;
