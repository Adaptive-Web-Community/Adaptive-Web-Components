import {
    itemContainerDensityStyles,
    layerShapeStyles,
    plainTextStyles,
    StyleModules,
    Styles,
} from "@adaptive-web/adaptive-ui";
import { PickerAnatomy } from "./picker.template.js";

const menuStyles = Styles.compose(
    [
        plainTextStyles,
        layerShapeStyles,
        itemContainerDensityStyles,
    ],
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
