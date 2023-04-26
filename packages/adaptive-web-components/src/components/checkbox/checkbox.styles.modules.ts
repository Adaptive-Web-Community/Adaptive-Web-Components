import {
    selectableSelectedStyles,
    selectableUnselectedStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { CheckboxAnatomy } from "./checkbox.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
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
