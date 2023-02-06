import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerListItem, pickerListItemTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Picker List Item template, {@link @microsoft/fast-foundation#pickerListItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerListItem> =
    (ds: DesignSystem) =>
        pickerListItemTemplate();
