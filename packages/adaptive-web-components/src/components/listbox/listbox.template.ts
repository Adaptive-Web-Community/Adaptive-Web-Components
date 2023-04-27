import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTListboxElement, listboxTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const ListboxConditions = {
};

export const ListboxParts = {
};

export const ListboxAnatomy: ComponentAnatomy<typeof ListboxConditions, typeof ListboxParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ListboxConditions,
    parts: ListboxParts,
};

/**
 * Default Listbox template, {@link @microsoft/fast-foundation#listboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTListboxElement> =
    (ds: DesignSystem) =>
        listboxTemplate();
