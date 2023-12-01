import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    labelTextStyles,
    roundShapeStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles
} from "@adaptive-web/adaptive-ui/reference";
import { RadioAnatomy } from "./radio.template.js";

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
            part: RadioAnatomy.parts.label,
        },
        labelTextStyles
    ],
    [
        {
            part: RadioAnatomy.parts.control,
        },
        Styles.compose([
            selectableUnselectedStyles,
            roundShapeStyles,
        ]),
    ],
    [
        {
            hostCondition: RadioAnatomy.conditions.checked,
            part: RadioAnatomy.parts.control,
        },
        Styles.compose([
            selectableSelectedStyles,
            roundShapeStyles,
        ]),
    ],
];
