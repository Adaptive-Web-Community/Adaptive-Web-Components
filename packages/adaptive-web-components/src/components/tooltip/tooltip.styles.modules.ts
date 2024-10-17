import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlDensityStyles,
    controlShapeStyles,
    neutralFillSubtle,
    plainTextStyles,
    shadowTooltipStyles
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
            controlDensityStyles,
            plainTextStyles,
            shadowTooltipStyles,
        ],
        properties: {
            backgroundFill: neutralFillSubtle.rest,
        },
    },
];
