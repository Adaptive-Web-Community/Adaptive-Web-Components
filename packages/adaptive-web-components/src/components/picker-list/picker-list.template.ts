import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerList, pickerListTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const PickerListConditions = {
};

export const PickerListParts = {
};

export const PickerListAnatomy: ComponentAnatomy<typeof PickerListConditions, typeof PickerListParts> = {
    interactivity: Interactivity.always,
    conditions: PickerListConditions,
    parts: PickerListParts,
};

/**
 * Default Picker List template, {@link @microsoft/fast-foundation#pickerListTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerList> =
    (ds: DesignSystem) =>
        pickerListTemplate();
