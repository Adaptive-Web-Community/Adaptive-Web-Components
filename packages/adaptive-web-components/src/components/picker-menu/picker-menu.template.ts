import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerMenu, pickerMenuTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Picker Menu template, {@link @microsoft/fast-foundation#pickerMenuTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerMenu> =
    (ds: DesignSystem) =>
        pickerMenuTemplate();
