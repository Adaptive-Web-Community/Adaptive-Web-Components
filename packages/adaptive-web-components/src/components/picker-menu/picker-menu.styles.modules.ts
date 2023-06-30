import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    itemContainerDensityStyles,
    layerShapeStyles
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
            ],
        )
    ],
];
