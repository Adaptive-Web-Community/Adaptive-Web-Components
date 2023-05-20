import {
    itemContainerDensityStyles,
    layerShapeStyles,
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
            layerShapeStyles,
            itemContainerDensityStyles,
        )
    ],
];
