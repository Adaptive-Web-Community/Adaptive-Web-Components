import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    plainTextStyles,
    roundShapeStyles,
    selectableSelectedStyles,
    selectableUnselectedStyles
} from "@adaptive-web/adaptive-ui/reference";
import { RadioAnatomy } from "./radio.template.js";

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
            part: RadioAnatomy.parts.label,
        },
        styles: plainTextStyles,
    },
    {
        target : {
            part: RadioAnatomy.parts.control,
        },
        styles: [
            selectableUnselectedStyles,
            roundShapeStyles,
        ],
    },
    {
        target : {
            contextCondition: RadioAnatomy.conditions.checked,
            part: RadioAnatomy.parts.control,
        },
        styles: [
            selectableSelectedStyles,
            roundShapeStyles,
        ],
    },
];
