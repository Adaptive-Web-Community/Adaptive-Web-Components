import { StyleRules } from "@adaptive-web/adaptive-ui";
import { highlightFillReadableControlStyles, itemStyles } from "@adaptive-web/adaptive-ui/reference";
import { PickerMenuOptionAnatomy } from "./picker-menu-option.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: itemStyles,
    },
    {
        target : {
            contextCondition: PickerMenuOptionAnatomy.conditions.selected,
        },
        styles: highlightFillReadableControlStyles,
    },
];
