import {
    labelTextStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { RadioAnatomy } from "./radio.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: RadioAnatomy.parts.label,
        },
        labelTextStyles
    ],
    [
        {
            part: RadioAnatomy.parts.control,
        },
        selectableUnselectedStyles
    ],
    [
        {
            hostCondition: RadioAnatomy.conditions.checked,
            part: RadioAnatomy.parts.control,
        },
        selectableSelectedStyles
    ],
];
