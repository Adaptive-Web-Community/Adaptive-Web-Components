import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    plainTextStyles,
    roundShapeStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles
} from "@adaptive-web/adaptive-ui/reference";
import { SwitchAnatomy } from "./switch.template.js";

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
        }),
    ],
    [
        {
            part: SwitchAnatomy.parts.label,
        },
        plainTextStyles,
    ],
    [
        {
            part: SwitchAnatomy.parts.switch,
        },
        Styles.compose([
            selectableUnselectedStyles,
            roundShapeStyles,
        ]),
    ],
    [
        {
            hostCondition: SwitchAnatomy.conditions.checked,
            part: SwitchAnatomy.parts.switch,
        },
        Styles.compose([
            selectableSelectedStyles,
            roundShapeStyles,
        ]),
    ],
    [
        {
            part: SwitchAnatomy.parts.thumb,
        },
        roundShapeStyles,
    ]
];
