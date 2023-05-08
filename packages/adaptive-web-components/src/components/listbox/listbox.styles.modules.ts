import {
    controlShapeStyles,
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
            controlShapeStyles,
            Styles.fromProperties({
                borderFill: neutralStrokeSubtleRest
            }),
        )
    ],
];
