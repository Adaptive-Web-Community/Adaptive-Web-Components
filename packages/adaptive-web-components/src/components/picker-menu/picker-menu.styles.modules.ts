import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    itemContainerDensityStyles,
    layerFillFixedPlus1,
    layerShapeStyles,
    shadowFlyoutStyles
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
                itemContainerDensityStyles,
                shadowFlyoutStyles,
            ], {
                backgroundFill: layerFillFixedPlus1,
            }
        )
    ],
];
