import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    labelTextStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles
} from "@adaptive-web/adaptive-ui/reference";
import { CheckboxAnatomy } from "./checkbox.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.fromProperties({
            gap: densityControl.horizontalGap,
        })
    ],
    [
        {
            part: CheckboxAnatomy.parts.label,
        },
        labelTextStyles
    ],
    [
        {
            part: CheckboxAnatomy.parts.control,
        },
        selectableUnselectedStyles
    ],
    [
        {
            hostCondition: CheckboxAnatomy.conditions.checked,
            part: CheckboxAnatomy.parts.control,
        },
        selectableSelectedStyles
    ],
];
