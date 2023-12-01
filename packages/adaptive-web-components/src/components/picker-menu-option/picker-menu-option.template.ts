import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerMenuOption, pickerMenuOptionTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const PickerMenuOptionConditions = {
    selected: "[aria-selected='true']",
};

/**
 * @public
 */
export const PickerMenuOptionParts = {
};

/**
 * @public
 */
export const PickerMenuOptionAnatomy: ComponentAnatomy<typeof PickerMenuOptionConditions, typeof PickerMenuOptionParts> = {
    interactivity: Interactivity.always,
    conditions: PickerMenuOptionConditions,
    parts: PickerMenuOptionParts,
};

/**
 * Default Picker Menu Option template, {@link @microsoft/fast-foundation#pickerMenuOptionTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerMenuOption> =
    (ds: DesignSystem) =>
        pickerMenuOptionTemplate();
