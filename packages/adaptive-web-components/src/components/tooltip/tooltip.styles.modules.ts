import {
    BorderFill,
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference"; 
import { neutralStrokeSubtleRest } from "@adaptive-web/adaptive-ui/reference";

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
