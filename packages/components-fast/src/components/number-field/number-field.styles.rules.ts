import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { NumberFieldAnatomy } from "./number-field.template.js";

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
        },
    },
    {
        target : {
            part: NumberFieldAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: NumberFieldAnatomy.parts.root,
        },
        treatments: [tokens.treatments.inputAutofillControl],
    },
    {
        target : {
            part: NumberFieldAnatomy.parts.control,
        },
        treatments: [tokens.density.control.treatment.autofillInner],
    },
];
