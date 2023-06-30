import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    accentFillReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { DisclosureAnatomy } from "./disclosure.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        typeRampBaseStyles
    ],
    [
        {
            part: DisclosureAnatomy.parts.invoker
        },
        Styles.compose(
            [
                controlShapeStyles,
                controlDensityStyles,
                accentFillReadableControlStyles,
            ],
        )
    ],
];
