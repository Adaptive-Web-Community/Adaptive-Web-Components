import {
    BorderFill,
    controlShapeStyles,
    itemContainerDensityStyles,
    neutralStrokeSubtleRest,
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
            [
                controlShapeStyles,
                itemContainerDensityStyles,
            ],
            {
                ...BorderFill.all(neutralStrokeSubtleRest),
            },
        )
    ],
];
