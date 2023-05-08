import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerList, pickerListTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const PickerListConditions = {
};

/**
 * @public
 */
export const PickerListParts = {
};

/**
 * @public
 */
export const PickerListAnatomy: ComponentAnatomy<typeof PickerListConditions, typeof PickerListParts> = {
    interactivity: Interactivity.always,
    conditions: PickerListConditions,
    parts: PickerListParts,
};

/**
 * Default Picker List template, {@link @microsoft/fast-foundation#pickerListTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerList> =
    (ds: DesignSystem) =>
        pickerListTemplate();
