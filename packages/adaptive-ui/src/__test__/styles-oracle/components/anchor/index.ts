import { refs } from "design-token-library";
import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";
import {
    accentForegroundReadableControlTreatment,
    controlShapeTreatment,
    neutralForegroundStrongElementTreatment,
    typeRampBaseTreatment,
} from "../../../../reference/treatments.js";

const { density } = refs<ReferenceLibraryTokens>();

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
        treatments: [
            controlShapeTreatment,
            typeRampBaseTreatment,
            accentForegroundReadableControlTreatment,
        ],
        properties: {
            gap: density.control.horizontal.gap,
        },
    },
    {
        target: {
            contextCondition: AnchorAnatomy.conditions.noHref,
            part: AnchorAnatomy.parts.control,
        },
        treatments: [neutralForegroundStrongElementTreatment],
    },
];
