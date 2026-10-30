import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { TextFieldAnatomy } from "./text-field.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [tokens.typography.ramp.default.treatments.base],
        properties: {
            gap: tokens.density.control.vertical.gap,
        }
    },
    {
        target : {
            part: TextFieldAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: TextFieldAnatomy.parts.root,
        },
        treatments: [tokens.treatments.inputAutofillControl],
    },
    {
        target : {
            part: TextFieldAnatomy.parts.control,
        },
        treatments: [tokens.density.control.treatment.autofillInner],
    },
];
