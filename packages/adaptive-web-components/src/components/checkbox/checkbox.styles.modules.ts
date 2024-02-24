import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    plainTextStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles
} from "@adaptive-web/adaptive-ui/reference";
import { CheckboxAnatomy } from "./checkbox.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            gap: densityControl.horizontalGap,
        },
    },
    {
        target : {
            part: CheckboxAnatomy.parts.label,
        },
        styles: plainTextStyles,
    },
    {
        target : {
            part: CheckboxAnatomy.parts.control,
        },
        styles: selectableUnselectedStyles,
    },
    {
        target : {
            hostCondition: CheckboxAnatomy.conditions.checked,
            part: CheckboxAnatomy.parts.control,
        },
        styles: selectableSelectedStyles,
    },
];
