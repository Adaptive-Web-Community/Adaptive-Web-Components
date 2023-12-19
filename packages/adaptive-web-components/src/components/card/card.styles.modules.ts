import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    layerFillInteractiveRest,
    layerShapeStyles,
    plainTextStyles,
    shadowCardStyles
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
                shadowCardStyles,
            ], {
                backgroundFill: layerFillInteractiveRest,
            }
        )
    ],
];
