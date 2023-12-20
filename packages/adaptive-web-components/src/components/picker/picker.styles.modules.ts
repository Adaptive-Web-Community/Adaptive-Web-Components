import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    flyoutStyles,
    itemContainerDensityStyles,
    plainTextStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { PickerAnatomy } from "./picker.template.js";

const menuStyles = Styles.compose(
    [
        plainTextStyles,
        itemContainerDensityStyles,
        flyoutStyles,
    ]
);

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: PickerAnatomy.parts.loadingDisplay
        },
        menuStyles
    ],
    [
        {
            part: PickerAnatomy.parts.noOptionsDisplay
        },
        menuStyles
    ],
];
