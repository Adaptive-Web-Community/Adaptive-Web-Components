import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { AvatarAnatomy } from "./avatar.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [tokens.typography.ramp.default.treatments.base],
    },
    {
        target : {
            part: AvatarAnatomy.parts.backplate,
        },
        treatments: [tokens.color.accent.treatments.fillReadableControl],
    },
];
