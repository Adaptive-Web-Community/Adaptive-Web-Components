import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    inputStyles,
    labelTextStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { TextAreaAnatomy } from "./text-area.template.js";

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
                typeRampBaseStyles,
            ],
            {
                gap: densityControl.verticalGap,
            }
        ),
    ],
    [
        {
            part: TextAreaAnatomy.parts.label
        },
        labelTextStyles
    ],
    [
        {
            part: TextAreaAnatomy.parts.control
        },
        inputStyles
    ],
];
