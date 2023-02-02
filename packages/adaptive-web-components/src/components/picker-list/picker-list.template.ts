import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerList, pickerListTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Picker List template, {@link @microsoft/fast-foundation#pickerListTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerList> =
    (ds: DesignSystem) =>
        pickerListTemplate();
