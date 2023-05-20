import {
    accentForegroundReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    neutralForegroundStrongElementStyles,
    plainTextStyles,
    StyleModules,
    Styles,
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
            part: AccordionItemAnatomy.parts.heading,
        },
        Styles.compose(
            controlShapeStyles,
            controlDensityStyles,
        )
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
    [
        {
            part: AccordionItemAnatomy.parts.region,
        },
        controlDensityStyles
    ],
];
