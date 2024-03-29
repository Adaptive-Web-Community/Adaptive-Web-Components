import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPickerMenu, pickerMenuTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const PickerMenuConditions = {
};

/**
 * @public
 */
export const PickerMenuParts = {
    optionsDisplay: "options-display",
    headerRegion: "header-region",
    footerRegion: "footer-region",
    suggestionsAvailableAlert: "suggestions-available-alert",
};

/**
 * @public
 */
export const PickerMenuAnatomy: ComponentAnatomy<typeof PickerMenuConditions, typeof PickerMenuParts> = {
    interactivity: Interactivity.never,
    conditions: PickerMenuConditions,
    parts: PickerMenuParts,
};

/**
 * Default Picker Menu template, {@link @microsoft/fast-foundation#pickerMenuTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPickerMenu> =
    (ds: DesignSystem) =>
        pickerMenuTemplate();
