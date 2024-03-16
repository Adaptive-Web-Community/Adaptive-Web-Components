import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    flyoutStyles,
    itemContainerDensityStyles,
    plainTextStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { PickerAnatomy } from "./picker.template.js";

const menuStyles = [
    plainTextStyles,
    itemContainerDensityStyles,
    flyoutStyles,
];

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: PickerAnatomy.parts.loadingDisplay,
        },
        styles: menuStyles,
    },
    {
        target : {
            part: PickerAnatomy.parts.noOptionsDisplay,
        },
        styles: menuStyles,
    },
];
