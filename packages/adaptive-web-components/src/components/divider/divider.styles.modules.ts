import { neutralStrokeSubtleRest, strokeThickness, StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import { DividerAnatomy } from "./divider.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            hostCondition: DividerAnatomy.conditions.horizontal,
        },
        Styles.fromProperties(
            {
                borderFillTop: neutralStrokeSubtleRest,
                borderStyleTop: "solid",
                borderThicknessTop: strokeThickness,
            }
        ),
    ],
    [
        {
            hostCondition: DividerAnatomy.conditions.vertical,
        },
        Styles.fromProperties(
            {
                borderFillLeft: neutralStrokeSubtleRest,
                borderStyleLeft: "solid",
                borderThicknessLeft: strokeThickness,
            }
        ),
    ],
];
