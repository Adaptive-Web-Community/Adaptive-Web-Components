import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    controlDensityStyles,
    plainTextStyles
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
                plainTextStyles,
                controlDensityStyles,
            ],
        )
    ],
];
