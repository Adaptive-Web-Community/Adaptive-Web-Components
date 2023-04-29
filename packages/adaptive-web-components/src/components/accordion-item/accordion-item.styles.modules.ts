import {
    accentForegroundReadableControlStyles,
    neutralForegroundStrongElementStyles,
    plainTextStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { AccordionItemAnatomy } from "./accordion-item.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        plainTextStyles
    ],
    [
        {
            part: AccordionItemAnatomy.parts.button,
        },
        neutralForegroundStrongElementStyles
    ],
    [
        {
            part: AccordionItemAnatomy.parts.icon,
        },
        accentForegroundReadableControlStyles
    ],
];
