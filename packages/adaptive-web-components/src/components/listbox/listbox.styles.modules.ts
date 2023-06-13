import {
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
                borderFill: neutralStrokeSubtleRest,
            },
        )
    ],
];
