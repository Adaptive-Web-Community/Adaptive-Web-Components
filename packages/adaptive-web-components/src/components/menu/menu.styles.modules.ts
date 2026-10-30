import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        treatments: [
            tokens.density.controlList.treatment,
            tokens.treatments.flyout,
        ],
    },
];
