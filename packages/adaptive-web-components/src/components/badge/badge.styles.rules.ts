import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [
            tokens.typography.ramp.default.treatments.minus1,
            tokens.shape.treatments.control,
            tokens.color.neutral.treatments.fillReadableControl,
        ],
    },
];
