import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { PickerAnatomy } from "./picker.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
    {
        target : {
            part: PickerAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: PickerAnatomy.parts.root,
        },
        treatments: [tokens.treatments.inputControl],
    },
    {
        target : {
            part: PickerAnatomy.parts.popup,
        },
        treatments: [tokens.treatments.flyout],
    },
    {
        target : {
            part: PickerAnatomy.parts.listbox,
        },
        treatments: [tokens.density.controlList.treatment],
    },
    {
        target : {
            part: PickerAnatomy.parts.status,
        },
        treatments: [tokens.density.controlList.treatment],
    },
];
