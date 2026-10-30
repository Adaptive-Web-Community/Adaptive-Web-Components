import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { RadioAnatomy } from "./radio.template.js";

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
            part: RadioAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textPlain],
    },
    {
        target : {
            part: RadioAnatomy.parts.control,
        },
        treatments: [
            tokens.treatments.selectableControlUnselected,
            tokens.shape.treatments.round,
        ],
    },
    {
        target : {
            contextCondition: RadioAnatomy.conditions.checked,
            part: RadioAnatomy.parts.control,
        },
        treatments: [
            tokens.treatments.selectableControlSelected,
            tokens.shape.treatments.round,
        ],
    },
];
