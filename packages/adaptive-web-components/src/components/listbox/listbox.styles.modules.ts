import {
    BorderFill,
    controlShapeStyles,
    itemContainerDensityStyles,
    StyleModules,
    Styles,
} from "@adaptive-web/adaptive-ui";
import { neutralStrokeSubtleRest } from "@adaptive-web/adaptive-ui/reference";

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
