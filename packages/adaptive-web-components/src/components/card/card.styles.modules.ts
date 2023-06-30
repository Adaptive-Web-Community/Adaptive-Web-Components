import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    layerShapeStyles,
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
                layerShapeStyles,
                plainTextStyles,
            ],
        )
    ],
];
