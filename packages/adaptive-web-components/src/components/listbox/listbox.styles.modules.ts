import {
    BorderFill,
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    itemContainerDensityStyles
} from "@adaptive-web/adaptive-ui/reference";
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
