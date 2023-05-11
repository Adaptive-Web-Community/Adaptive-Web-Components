import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTListboxOption, listboxOptionTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const ListboxOptionConditions = {
    checked: "[aria-checked='true']",
    selected: "[aria-selected='true']",
};

/**
 * @public
 */
export const ListboxOptionParts = {
    content: "content",
};

/**
 * @public
 */
export const ListboxOptionAnatomy: ComponentAnatomy<typeof ListboxOptionConditions, typeof ListboxOptionParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ListboxOptionConditions,
    parts: ListboxOptionParts,
};

/**
 * Default Listbox Option template, {@link @microsoft/fast-foundation#listboxOptionTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTListboxOption> =
    (ds: DesignSystem) =>
        listboxOptionTemplate();
