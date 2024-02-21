import {
    BorderFill,
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlDensityStyles,
    controlShapeStyles,
    neutralFillSubtle,
    neutralStrokeSubtle,
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
            ...BorderFill.all(neutralStrokeSubtle.rest),
            backgroundFill: neutralFillSubtle.rest,
        },
    },
];
