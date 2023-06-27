import { neutralStrokeSubtleRest, strokeThickness, StyleModules, Styles } from "@adaptive-web/adaptive-ui";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.fromProperties(
            {
                borderFillBottom: neutralStrokeSubtleRest,
                borderStyleBottom: "solid",
                borderThicknessBottom: strokeThickness,
            }
        ),
    ],
];
