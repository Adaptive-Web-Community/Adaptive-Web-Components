import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlListDensityStyles,
    controlShapeStyles,
    neutralOutlineDiscernibleControlStyles,
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
            controlListDensityStyles,
            neutralOutlineDiscernibleControlStyles,
        ],
    },
];
