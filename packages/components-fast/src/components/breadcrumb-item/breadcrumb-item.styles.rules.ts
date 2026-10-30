import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { BreadcrumbItemAnatomy } from "./breadcrumb-item.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [tokens.treatments.textPlain],
    },
    {
        target : {
            part: BreadcrumbItemAnatomy.parts.control,
        },
        treatments: [
            tokens.shape.treatments.control,
            tokens.density.control.treatment,
        ],
    },
    {
        target : {
            contextCondition: BreadcrumbItemAnatomy.conditions.noHref,
            part: BreadcrumbItemAnatomy.parts.control,
        },
        treatments: [tokens.color.neutral.treatments.foregroundStrongElement],
    },
    {
        target : {
            contextCondition: BreadcrumbItemAnatomy.interactivity?.interactive,
            part: BreadcrumbItemAnatomy.parts.control,
            partCondition: BreadcrumbItemAnatomy.conditions.current,
        },
        treatments: [tokens.color.neutral.treatments.foregroundStrongElement],
    },
    {
        target : {
            contextCondition: BreadcrumbItemAnatomy.interactivity?.interactive,
            part: BreadcrumbItemAnatomy.parts.control,
        },
        treatments: [tokens.color.accent.treatments.foregroundReadableControl],
    },
];
