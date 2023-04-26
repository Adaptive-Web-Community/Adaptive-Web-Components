import {
    labelTextStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { SwitchAnatomy } from "./switch.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: SwitchAnatomy.parts.label,
        },
        labelTextStyles
    ],
    [
        {
            part: SwitchAnatomy.parts.switch,
        },
        selectableUnselectedStyles
    ],
    [
        {
            hostCondition: SwitchAnatomy.conditions.checked,
            part: SwitchAnatomy.parts.switch,
        },
        selectableSelectedStyles
    ],
];
