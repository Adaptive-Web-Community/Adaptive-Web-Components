import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    neutralFillReadableControlStyles,
    typeRampMinus1Styles,
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: [
            typeRampMinus1Styles,
            controlShapeStyles,
            neutralFillReadableControlStyles,
        ],
    },
];
