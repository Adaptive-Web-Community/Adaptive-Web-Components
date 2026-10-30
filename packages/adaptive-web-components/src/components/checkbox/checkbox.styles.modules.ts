import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { CheckboxAnatomy } from "./checkbox.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            gap: tokens.density.control.horizontal.gap,
        },
    },
    {
        target : {
            part: CheckboxAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textPlain],
    },
    {
        target : {
            part: CheckboxAnatomy.parts.control,
        },
        treatments: [tokens.treatments.selectableControlUnselected],
    },
    {
        target : {
            contextCondition: CheckboxAnatomy.conditions.checked,
            part: CheckboxAnatomy.parts.control,
        },
        treatments: [tokens.treatments.selectableControlSelected],
    },
];
