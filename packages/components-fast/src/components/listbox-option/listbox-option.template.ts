import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import {
    listboxOptionDocumentation,
    ListboxOptionParts,
    ListboxOptionSlots,
    listboxOptionWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ListboxOption } from "./listbox-option.js";

/**
 * @public
 */
export const ListboxOptionAnatomy = documentationToComponentAnatomy(listboxOptionDocumentation, listboxOptionWebBinding);

/**
 * Default Listbox Option template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<ListboxOption> =
    (ds: DesignSystem) => html<ListboxOption>`
        <slot name=${(_) => ListboxOptionSlots.start}></slot>
        <span class=${(_) => ListboxOptionParts.content} part=${(_) => ListboxOptionParts.content}>
            <slot></slot>
        </span>
        <slot name=${(_) => ListboxOptionSlots.end}></slot>
    `;
