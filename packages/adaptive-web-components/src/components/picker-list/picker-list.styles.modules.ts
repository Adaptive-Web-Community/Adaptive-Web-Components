import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    neutralOutlineDiscernibleControlStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: [
            controlShapeStyles,
            typeRampBaseStyles,
            neutralOutlineDiscernibleControlStyles
        ],
    },
];
