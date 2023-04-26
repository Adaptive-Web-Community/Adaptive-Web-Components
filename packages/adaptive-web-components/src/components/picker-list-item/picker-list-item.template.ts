import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerListItem, pickerListItemTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const PickerListItemConditions = {
};

export const PickerListItemParts = {
};

export const PickerListItemAnatomy: ComponentAnatomy<typeof PickerListItemConditions, typeof PickerListItemParts> = {
    interactivity: Interactivity.always,
    conditions: PickerListItemConditions,
    parts: PickerListItemParts,
};

/**
 * Default Picker List Item template, {@link @microsoft/fast-foundation#pickerListItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerListItem> =
    (ds: DesignSystem) =>
        pickerListItemTemplate();
