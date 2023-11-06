import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import { actionStyles, controlSquareDensityStyles, roundShapeStyles } from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.compose([
            actionStyles,
            roundShapeStyles,
            controlSquareDensityStyles,
        ]),
    ],
];
