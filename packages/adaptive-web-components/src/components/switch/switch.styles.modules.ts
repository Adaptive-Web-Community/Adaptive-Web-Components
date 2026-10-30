import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { SwitchAnatomy } from "./switch.template.js";

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
            part: SwitchAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textPlain],
    },
    {
        target : {
            part: SwitchAnatomy.parts.switch,
        },
        treatments: [
            tokens.treatments.selectableControlUnselected,
            tokens.shape.treatments.round,
        ],
    },
    {
        target : {
            contextCondition: SwitchAnatomy.conditions.checked,
            part: SwitchAnatomy.parts.switch,
        },
        treatments: [
            tokens.treatments.selectableControlSelected,
            tokens.shape.treatments.round,
        ],
    },
    {
        target : {
            part: SwitchAnatomy.parts.thumb,
        },
        treatments: [tokens.shape.treatments.round],
    },
];
