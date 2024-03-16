import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    accentForegroundReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    neutralForegroundStrongElementStyles,
    neutralStrokeSubtle,
    plainTextStyles,
    strokeThickness
} from "@adaptive-web/adaptive-ui/reference";
import { AccordionItemAnatomy } from "./accordion-item.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: plainTextStyles,
        properties: {
            borderFillBottom: neutralStrokeSubtle.rest,
            borderStyleBottom: "solid",
            borderThicknessBottom: strokeThickness,
        },
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.heading,
        },
        styles: [
            controlShapeStyles,
            controlDensityStyles,
        ],
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.button,
        },
        styles: neutralForegroundStrongElementStyles,
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.icon,
        },
        styles: accentForegroundReadableControlStyles,
    },
    {
        target : {
            part: AccordionItemAnatomy.parts.region,
        },
        styles: controlDensityStyles,
    },
];
