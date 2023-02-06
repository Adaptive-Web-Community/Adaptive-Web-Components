import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerMenuOption, pickerMenuOptionTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Picker Menu Option template, {@link @microsoft/fast-foundation#pickerMenuOptionTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerMenuOption> =
    (ds: DesignSystem) =>
        pickerMenuOptionTemplate();
