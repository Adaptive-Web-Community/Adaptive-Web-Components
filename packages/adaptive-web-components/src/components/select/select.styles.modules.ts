import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { SelectAnatomy } from "./select.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
    {
        target : {
            part: SelectAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: SelectAnatomy.parts.control,
        },
        treatments: [tokens.treatments.inputControl],
    },
    {
        target : {
            part: SelectAnatomy.parts.listbox,
        },
        treatments: [tokens.density.controlList.treatment],
    },
    {
        target : {
            part: SelectAnatomy.parts.listbox,
        },
        treatments: [tokens.treatments.flyout],
    },
];
