import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    flyoutStyles,
    itemContainerDensityStyles,
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
                itemContainerDensityStyles,
                flyoutStyles,
            ],
        )
    ],
];
