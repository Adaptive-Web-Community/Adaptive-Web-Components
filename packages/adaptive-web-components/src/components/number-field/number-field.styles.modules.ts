import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import {
    autofillInnerDensityStyles,
    densityControl,
    inputAutofillStyles,
    labelTextStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { NumberFieldAnatomy } from "./number-field.template.js";

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
            part: NumberFieldAnatomy.parts.label
        },
        labelTextStyles
    ],
    [
        {
            part: NumberFieldAnatomy.parts.root
        },
        inputAutofillStyles
    ],
    [
        {
            part: NumberFieldAnatomy.parts.control
        },
        autofillInnerDensityStyles
    ],
];
