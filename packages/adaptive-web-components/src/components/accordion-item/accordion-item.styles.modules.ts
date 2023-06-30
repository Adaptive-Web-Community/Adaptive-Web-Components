import {
    accentForegroundReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    neutralForegroundStrongElementStyles,
    plainTextStyles,
    StyleModules,
    Styles,
} from "@adaptive-web/adaptive-ui";
import {
    neutralStrokeSubtleRest,
    strokeThickness
} from "@adaptive-web/adaptive-ui/reference";
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
        Styles.compose(
            [
                plainTextStyles
            ],
            {
                borderFillBottom: neutralStrokeSubtleRest,
                borderStyleBottom: "solid",
                borderThicknessBottom: strokeThickness,
            }
        ),
    ],
    [
        {
            part: AccordionItemAnatomy.parts.heading,
        },
        Styles.compose(
            [
                controlShapeStyles,
                controlDensityStyles,
            ],
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
