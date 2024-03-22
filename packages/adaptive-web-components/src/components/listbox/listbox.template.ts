import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTListboxElement, listboxTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const ListboxConditions = {
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
    interactivity: Interactivity.disabledAttribute,
    conditions: ListboxConditions,
    parts: ListboxParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Listbox template, {@link @microsoft/fast-foundation#listboxTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTListboxElement> =
    (ds: DesignSystem) =>
        listboxTemplate();
