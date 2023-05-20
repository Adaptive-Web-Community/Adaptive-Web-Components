import {
    controlDensityStyles,
    controlShapeStyles,
    plainTextStyles,
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
            controlShapeStyles,
            controlDensityStyles,
            plainTextStyles,
        )
    ],
];
