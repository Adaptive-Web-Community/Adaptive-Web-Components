import {
    neutralStrokeSubtleRest,
    plainTextStyles,
    strokeThickness,
    StyleModules,
    Styles,
} from "@adaptive-web/adaptive-ui";

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
