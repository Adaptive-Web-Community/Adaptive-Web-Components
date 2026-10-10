import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/index.js";
import {
    accentForegroundReadableControlStyles,
    controlShapeStyles,
    densityControl,
    neutralForegroundStrongElementStyles,
    typeRampBaseStyles,
} from "../../../../reference/index.js";

// Adapted from the Adaptive Web Components `anchor`.

export const AnchorConditions = {
    iconOnly: ".icon-only",
    noHref: ":not([href])",
};

export const AnchorParts = {
    control: "control",
    content: "content",
};

export const AnchorAnatomy: ComponentAnatomy<typeof AnchorConditions, typeof AnchorParts> = {
    interactivity: Interactivity.hrefAttribute,
    conditions: AnchorConditions,
    parts: AnchorParts,
    focus: Focus.partFocused("control"),
};

export const anchorStyleModules: StyleRules = [
    {
        target: {
            part: AnchorAnatomy.parts.control,
        },
        styles: [
            controlShapeStyles,
            typeRampBaseStyles,
            accentForegroundReadableControlStyles,
        ],
        properties: {
            gap: densityControl.horizontalGap,
        },
    },
    {
        target: {
            contextCondition: AnchorAnatomy.conditions.noHref,
            part: AnchorAnatomy.parts.control,
        },
        styles: neutralForegroundStrongElementStyles,
    },
];
