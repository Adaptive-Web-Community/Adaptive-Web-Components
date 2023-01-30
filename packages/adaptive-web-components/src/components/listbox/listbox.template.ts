import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTListboxElement, listboxTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Listbox template, {@link @microsoft/fast-foundation#listboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTListboxElement> =
    (ds: DesignSystem) =>
        listboxTemplate();
