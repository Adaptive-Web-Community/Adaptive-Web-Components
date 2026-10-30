import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { ListboxAnatomy } from "./listbox.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
    {
        target : {
            part: ListboxAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: ListboxAnatomy.parts.options,
        },
        treatments: [
            tokens.shape.treatments.control,
            tokens.density.controlList.treatment,
            tokens.color.neutral.treatments.outlineDiscernibleControl,
        ],
    },
];
