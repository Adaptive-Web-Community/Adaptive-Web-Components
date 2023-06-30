import {
    BorderFill,
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    neutralStrokeSubtleRest,
    plainTextStyles
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
                plainTextStyles,
            ],
            {
                ...BorderFill.all(neutralStrokeSubtleRest),
            },
        )
    ],
];
