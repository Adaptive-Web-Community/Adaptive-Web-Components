import { StyleModules } from "@adaptive-web/adaptive-ui";
import { highlightFillReadableControlStyles, itemStyles } from "@adaptive-web/adaptive-ui/reference";
import { PickerMenuOptionAnatomy } from "./picker-menu-option.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        itemStyles,
    ],
    [
        {
            hostCondition: PickerMenuOptionAnatomy.conditions.selected,
        },
        highlightFillReadableControlStyles,
    ],
];
