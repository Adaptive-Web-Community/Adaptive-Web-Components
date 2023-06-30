import {
    plainTextStyles,
    StyleModules,
    Styles,
} from "@adaptive-web/adaptive-ui";
import {
    neutralStrokeSubtleRest,
    strokeThickness
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
                plainTextStyles
            ],
            {
                borderFillTop: neutralStrokeSubtleRest,
                borderStyleTop: "solid",
                borderThicknessTop: strokeThickness,
            }
        ),
    ],
];
