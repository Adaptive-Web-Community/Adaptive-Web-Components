import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { AccordionItemAnatomy } from "./accordion-item.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        treatments: [tokens.treatments.textPlain],
        properties: {
            borderFillBottom: { rest: tokens.color.neutral.stroke.subtle },
            borderStyleBottom: "solid",
            borderThicknessBottom: tokens.shape.strokeThickness.default,
        },
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.heading,
        },
        treatments: [
            tokens.shape.treatments.control,
            tokens.density.control.treatment,
        ],
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.button,
        },
        treatments: [tokens.color.neutral.treatments.foregroundStrongElement],
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.icon,
        },
        treatments: [tokens.color.accent.treatments.foregroundReadableControl],
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.panel,
        },
        treatments: [tokens.density.control.treatment],
    },
];
