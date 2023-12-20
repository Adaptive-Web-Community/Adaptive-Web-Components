import {
    BorderFill,
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    controlDensityStyles,
    controlShapeStyles,
    neutralFillSubtleRest,
    neutralStrokeSubtleRest,
    plainTextStyles,
    shadowTooltipStyles
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.compose(
            [
                controlShapeStyles,
                controlDensityStyles,
                plainTextStyles,
                shadowTooltipStyles,
            ],
            {
                ...BorderFill.all(neutralStrokeSubtleRest),
                backgroundFill: neutralFillSubtleRest,
            },
        )
    ],
];
