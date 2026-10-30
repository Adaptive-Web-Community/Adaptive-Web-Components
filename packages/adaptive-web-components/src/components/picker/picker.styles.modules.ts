import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlListDensityStyles,
    densityControl,
    flyoutStyles,
    inputStyles,
    labelTextStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { PickerAnatomy } from "./picker.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            gap: densityControl.verticalGap,
        },
    },
    {
        target : {
            part: PickerAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            part: PickerAnatomy.parts.root,
        },
        styles: inputStyles,
    },
    {
        target : {
            part: PickerAnatomy.parts.popup,
        },
        styles: flyoutStyles,
    },
    {
        target : {
            part: PickerAnatomy.parts.listbox,
        },
        styles: controlListDensityStyles,
    },
    {
        target : {
            part: PickerAnatomy.parts.status,
        },
        styles: controlListDensityStyles,
    },
];
