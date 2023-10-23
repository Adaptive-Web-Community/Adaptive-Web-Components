import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    itemContainerDensityStyles,
    neutralOutlineDiscernibleControlStyles,
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
                controlShapeStyles,
                itemContainerDensityStyles,
                neutralOutlineDiscernibleControlStyles,
            ],
        )
    ],
];
