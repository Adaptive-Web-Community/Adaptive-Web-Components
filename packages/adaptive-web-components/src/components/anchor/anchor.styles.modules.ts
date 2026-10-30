import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { AnchorAnatomy } from "./anchor.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: AnchorAnatomy.parts.control,
        },
        treatments: [
            tokens.shape.treatments.control,
            tokens.typography.ramp.default.treatments.base,
            tokens.color.accent.treatments.foregroundReadableControl,
        ],
        properties: {
            gap: tokens.density.control.horizontal.gap,
        },
    },
    {
        target : {
            contextCondition: AnchorAnatomy.conditions.noHref,
            part: AnchorAnatomy.parts.control,
        },
        treatments: [tokens.color.neutral.treatments.foregroundStrongElement],
    },
];
