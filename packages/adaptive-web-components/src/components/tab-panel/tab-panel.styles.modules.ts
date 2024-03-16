import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlDensityStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: [
            plainTextStyles,
            controlDensityStyles,
        ],
    },
];
