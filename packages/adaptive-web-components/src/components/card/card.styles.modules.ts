import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    layerFillInteractive,
    layerShapeStyles,
    plainTextStyles,
    shadowCardInteractiveStyles
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
                shadowCardInteractiveStyles,
            ], {
                backgroundFill: layerFillInteractive,
            }
        )
    ],
];
