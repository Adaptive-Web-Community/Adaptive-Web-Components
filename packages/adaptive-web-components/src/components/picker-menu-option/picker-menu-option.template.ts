import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerMenuOption, pickerMenuOptionTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const PickerMenuOptionConditions = {
};

export const PickerMenuOptionParts = {
};

export const PickerMenuOptionAnatomy: ComponentAnatomy<typeof PickerMenuOptionConditions, typeof PickerMenuOptionParts> = {
    interactivity: Interactivity.always,
    conditions: PickerMenuOptionConditions,
    parts: PickerMenuOptionParts,
};

/**
 * Default Picker Menu Option template, {@link @microsoft/fast-foundation#pickerMenuOptionTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerMenuOption> =
    (ds: DesignSystem) =>
        pickerMenuOptionTemplate();
