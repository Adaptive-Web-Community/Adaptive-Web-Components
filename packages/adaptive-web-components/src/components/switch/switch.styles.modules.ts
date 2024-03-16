import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    plainTextStyles,
    roundShapeStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles
} from "@adaptive-web/adaptive-ui/reference";
import { SwitchAnatomy } from "./switch.template.js";

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
            part: SwitchAnatomy.parts.label,
        },
        styles: plainTextStyles,
    },
    {
        target : {
            part: SwitchAnatomy.parts.switch,
        },
        styles: [
            selectableUnselectedStyles,
            roundShapeStyles,
        ],
    },
    {
        target : {
            hostCondition: SwitchAnatomy.conditions.checked,
            part: SwitchAnatomy.parts.switch,
        },
        styles: [
            selectableSelectedStyles,
            roundShapeStyles,
        ],
    },
    {
        target : {
            part: SwitchAnatomy.parts.thumb,
        },
        styles: roundShapeStyles,
    },
];
