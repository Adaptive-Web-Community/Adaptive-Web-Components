import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerListItem, pickerListItemTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const PickerListItemConditions = {
};

/**
 * @public
 */
export const PickerListItemParts = {
};

/**
 * @public
 */
export const PickerListItemAnatomy: ComponentAnatomy<typeof PickerListItemConditions, typeof PickerListItemParts> = {
    interactivity: Interactivity.always,
    conditions: PickerListItemConditions,
    parts: PickerListItemParts,
    focus: Focus.hostFocused(),
};

/**
 * Default Picker List Item template, {@link @microsoft/fast-foundation#pickerListItemTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerListItem> =
    (ds: DesignSystem) =>
        pickerListItemTemplate();
