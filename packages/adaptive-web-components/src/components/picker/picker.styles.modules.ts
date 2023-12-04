import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    itemContainerDensityStyles,
    layerFillFixedPlus1,
    layerShapeStyles,
    plainTextStyles,
    shadowFlyoutStyles
} from "@adaptive-web/adaptive-ui/reference";
import { PickerAnatomy } from "./picker.template.js";

const menuStyles = Styles.compose(
    [
        plainTextStyles,
        layerShapeStyles,
        itemContainerDensityStyles,
        shadowFlyoutStyles,
    ], {
        backgroundFill: layerFillFixedPlus1,
    }
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
