import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTListboxOption, listboxOptionTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Listbox Option template, {@link @microsoft/fast-foundation#listboxOptionTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTListboxOption> =
    (ds: DesignSystem) =>
        listboxOptionTemplate();
